import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { ConfigModule } from '@nestjs/config'
import { CreateAccountsController } from './controllers/create-account.controller'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { AuthenticateController } from './controllers/authenticate.controler'
import { CharacterController } from './controllers/character.controller'

@Module({
  imports: [ConfigModule.forRoot({
    validate: env => envSchema.parse(env),
    isGlobal: true,
  }),
  AuthModule,
],
  controllers: [CreateAccountsController, AuthenticateController, CharacterController],
  providers: [PrismaService],
})
export class AppModule {}
