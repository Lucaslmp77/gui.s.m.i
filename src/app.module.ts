import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./env";
import { AuthModule } from "./auth/auth.module";
import { AuthenticateModule } from "./module/authenticate/authenticate.module";
import { UserModule } from "./module/user/user.module";
import { CharacterModule } from "./module/character/character.module";
import { RpgGameModule } from "./module/rpg-game/rpg-game.module";

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
