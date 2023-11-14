import {Module} from "@nestjs/common";
import {SocketGateway} from "./socket.gateway";
import {TextModule} from "../text/text.module";

@Module({
    providers:[SocketGateway],
    imports: [TextModule]
})
export class GatewayModule{}