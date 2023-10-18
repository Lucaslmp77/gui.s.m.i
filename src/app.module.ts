import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./env";
import { AuthModule } from "./auth/auth.module";
import { AuthenticateModule } from "./module/authenticate/authenticate.module";
import { UserModule } from "./module/user/user.module";
import { CharacterModule } from "./module/character/character.module";

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
