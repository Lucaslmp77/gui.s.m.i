import {Module} from "@nestjs/common";
import {SocketGateway} from "./socket.gateway";
import {TextModule} from "../text/text.module";
import {TextController} from "../text/text.controller";
import {RpgGameModule} from "../module/rpg-game/rpg-game.module";

@Module({
    providers:[SocketGateway],
    imports: [TextModule, RpgGameModule]
})
export class GatewayModule{}