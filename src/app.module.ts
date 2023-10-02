import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateAccountsController } from './controllers/create-account.controller';

@Module({
  imports: [],
  controllers: [CreateAccountsController],
  providers: [PrismaService],
})
export class AppModule {}
