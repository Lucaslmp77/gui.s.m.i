import {Module} from "@nestjs/common";
import {SocketGateway} from "./socket.gateway";
import {TextModule} from "../text/text.module";
import {TextController} from "../text/text.controller";

@Module({
    providers:[SocketGateway],
    imports: [TextModule]
})
export class GatewayModule{}