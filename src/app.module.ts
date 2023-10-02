import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { ConfigModule } from '@nestjs/config'
import { CreateAccountsController } from './controllers/create-account.controller'
import { envSchema } from './env'

@Module({
  imports: [ConfigModule.forRoot({
    validate: env => envSchema.parse(env),
    isGlobal: true,
  })],
  controllers: [CreateAccountsController],
  providers: [PrismaService],
})
export class AppModule {}
