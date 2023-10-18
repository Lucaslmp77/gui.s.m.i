import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { ConfigModule } from "@nestjs/config";
import { CreateAccountsController } from "./module/user/user.controller";
import { envSchema } from "./env";
import { AuthModule } from "./auth/auth.module";
import { AuthenticateController } from "./module/authenticate/authenticate.controller";
import { CharacterController } from "./module/character/character.controller";
import { GameRuleController } from "./module/game-rule/game-rule.controller";
import { PermissionController } from "./module/permission/permission.controller";
import { RpgGameController } from "./module/rpg-game/rpg-game.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    CreateAccountsController,
    AuthenticateController,
    CharacterController,
    GameRuleController,
    PermissionController,
    RpgGameController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
