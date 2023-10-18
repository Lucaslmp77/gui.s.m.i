import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { ConfigModule } from "@nestjs/config";
import { CreateAccountsController } from "./controllers/create-account.controller";
import { envSchema } from "./env";
import { AuthModule } from "./auth/auth.module";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CharacterController } from "./controllers/character.controller";
import { GameRuleController } from "./controllers/game-rule.controller";
import { PermissionController } from "./controllers/permission.controller";
import { RpgGameController } from "./controllers/rpg-game.controller";

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
