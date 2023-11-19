import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TextService } from '../text/text.service';
import { startOfDay, endOfDay } from 'date-fns';
import { RpgGameService } from '../module/rpg-game/rpg-game.service';

interface Message {
    text: string;
    author: string;
    authorId: string;
    dateH: Date;
    room: string;
}

interface RoomUser {
    socket_id: string;
    name: string;
}

@WebSocketGateway()
export class SocketGateway {
    constructor(
        private readonly textService: TextService,
        private readonly rpgService: RpgGameService,
    ) {}

    @WebSocketServer()
    server!: Server;

    async onModuleInit() {
        this.server.on('connection', async (socket) => {
            let idRoom: string;
            let idUser: string;

            console.log(socket.id + ' client connected');

            socket.on('join', async (data) => {
                const { id, socketId, name } = data;
                idRoom = data.id;
                idUser = socket.id;

                socket.join(id);
                await this.rpgService.savePlayerInGame(id, socket.id, data.name);

                const todayStart = startOfDay(new Date());
                const todayEnd = endOfDay(new Date());

                const messages = await this.textService.findMany({
                    rpgGameId: id,
                    dateH: {
                        gte: todayStart,
                        lte: todayEnd,
                    },
                });

                socket.emit('messageHistory', messages);

                const usersRoom = await this.rpgService.getPlayersInGame(id);
                this.server.to(id).emit('userList', usersRoom);

                console.log(usersRoom);
            });

            socket.on('message', (data) => {
                this.server.to(data.room).emit('message', data.data);

                this.textService.create(data.data).then(() =>
                    console.log('Dados salvos com sucesso'),
                );
            });

            socket.on('disconnect', async () => {
                console.log(`${socket.id} cliente desconectado`);
                await this.rpgService.removePlayerFromGame(idRoom, idUser);
                console.log('sala'+ idRoom)
                const usersRoom = await this.rpgService.getPlayersInGame(idRoom);

                this.server.to(idRoom).emit('userList', usersRoom);
            });

        });
    }
}
