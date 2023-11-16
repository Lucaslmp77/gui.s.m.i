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
            /*socket.on("mesa", data => {
                const existingRoom = users.find(user => user.room === data.room);
                users.push({
                    username: data.username,
                    room: data.room,
                    description: data.description,
                    socket_id: data.id
                });
                console.log(users)
                if (existingRoom) {
                    console.log("a sala existe")
                    // A sala já existe, emita uma mensagem de erro ou tome outra ação
                    this.server.emit("error", "A sala já existe");
                } else {
                    console.log('sala nao existe')
                    // A sala não existe, crie a sala e adicione ao array de usuários
                    socket.join(data.room);

                }
            });*/

           /* socket.on("join", (mesa) =>{
                socket.join(mesa)

            })
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
                this.textService.create(data)
                this.server.emit('message', message)
            })*/

        });

    }
}
