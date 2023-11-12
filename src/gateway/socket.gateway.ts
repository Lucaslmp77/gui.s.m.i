import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(

)
export class SocketGateway {
    @WebSocketServer()
    server!: Server;
    onModuleInit(){
        this.server.on('connection',
            (socket) => {console.log('client connected')})
    }

    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: any){
        console.log(body)
    }
}
