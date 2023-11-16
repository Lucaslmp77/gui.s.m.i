import { WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server } from 'socket.io';
import {TextService} from "../text/text.service";
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

    constructor(private readonly textService: TextService) {}


    @WebSocketServer()
    server!: Server;

    onModuleInit() {
        let name : string;

        this.server.on('connection', (socket) => {
            console.log(socket.id + ' client connected');
            socket.on('join', (room) => {
                socket.join(room)
            })
            socket.on('message', (data) => {
                this.server.to(data.room).emit('message', data.data)
                console.log(data.data, data.room)
            })

        });

    }
}
