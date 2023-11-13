import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server } from 'socket.io';

interface Message {
    text: string,
    author: string,
    authorId: string,
    dateH: Date,
    room: string
}
interface RoomUser {
    socket_id: string,
    username: string,
    room: string,
    description: string
}
const users: RoomUser[] = []
const message: Message[] = [];
@WebSocketGateway()
export class SocketGateway {
    private connectedClients: Map<string, { username: string }> = new Map();

    @WebSocketServer()
    server!: Server;

    onModuleInit() {
        let name : string;

        this.server.on('connect', (socket) => {
            console.log(socket.id + ' client connected');
            socket.on("mesa", data => {
                const existingRoom = users.find(user => user.room === data.table.room);
                users.push({
                    username: data.table.username,
                    room: data.table.room,
                    description: data.table.description,
                    socket_id: socket.id
                });

                if (existingRoom) {
                    console.log("a sala existe")
                    // A sala já existe, emita uma mensagem de erro ou tome outra ação
                    this.server.emit("error", "A sala já existe");
                } else {
                    console.log('sala nao existe')
                    // A sala não existe, crie a sala e adicione ao array de usuários
                    socket.join(data.table.room);

                }
            });

            socket.on('list', lista => {
                console.log(lista)
                socket.emit('message', message)
                console.log(message)
            })
            socket.on('message', data => {
                message.push({
                    text: data.text,
                    author: data.username,
                    authorId: socket.id,
                    dateH: new Date(),
                    room: data.room
                });
                this.server.emit('message', message)
                console.log(message)
            })

        });

    }
}
