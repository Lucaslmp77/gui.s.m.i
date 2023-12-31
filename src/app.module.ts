import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./env";
import { AuthModule } from "./auth/auth.module";
import { AuthenticateModule } from "./module/authenticate/authenticate.module";
import { UserModule } from "./module/user/user.module";
import { CharacterModule } from "./module/character/character.module";
import { RpgGameModule } from "./module/rpg-game/rpg-game.module";
import { GameRuleModule } from "./module/game-rule/game-rule.module";
import { PermissionModule } from "./module/permission/permission.module";
import {GatewayModule} from "./gateway/gateway.module";
import { TextModule } from './text/text.module';
import { OtpModule } from "./module/otp/otp.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    AuthenticateModule,
    CharacterModule,
    RpgGameModule,
    GameRuleModule,
    PermissionModule,
    GatewayModule,
    TextModule,
    OtpModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
