import { WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server } from 'socket.io';
import {TextService} from "../text/text.service";
import { startOfDay, endOfDay } from 'date-fns';
interface Message {
    text: string,
    author: string,
    authorId: string,
    dateH: Date,
    room: string
}
interface RoomUser {
    socket_id: string
}
let users: RoomUser[] = []
const message: Message[] = [];
@WebSocketGateway()
export class SocketGateway {

    constructor(private readonly textService: TextService) {}


    @WebSocketServer()
    server!: Server;

    onModuleInit() {
        let name : string;

        this.server.on('connection', (socket) => {
            console.log(socket.id + ' client connected');
            socket.on('join', (room) => {
                const todayStart = startOfDay(new Date());
                const todayEnd = endOfDay(new Date());
                socket.join(room)
                users.push({ socket_id: socket.id });
                this.textService.findMany({
                    rpgGameId: room,
                    dateH: {
                        gte: todayStart,
                        lte: todayEnd,
                    },
                }).then(messages => {
                    socket.emit('messageHistory', messages);
                });
            })
            socket.on('message', (data) => {
                this.server.to(data.room).emit('message', data.data)
                console.log(data.data, data.room)
                this.textService.create(data.data).then(() => console.log('Dados salvos com sucesso'))
            })

            socket.on('disconnect', () => {
                console.log(`${socket.id} cliente desconectado`);
                // Remova o usuário desconectado da lista
                const index = users.findIndex(user => user.socket_id === socket.id);
                if (index !== -1) {
                    users.splice(index, 1);
                }
            });

        });

    }
}
