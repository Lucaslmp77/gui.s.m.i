import { Module } from '@nestjs/common';
import { TextService } from './text.service';
import { TextController } from './text.controller';
import {PrismaService} from "../prisma/prisma.service";

@Module({
  controllers: [TextController],
  providers: [TextService,PrismaService],
  exports: [TextService]
})
export class TextModule {}
