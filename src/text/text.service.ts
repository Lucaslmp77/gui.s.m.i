import { Injectable } from '@nestjs/common';
import { CreateTextDto } from './dto/create-text.dto';
import { UpdateTextDto } from './dto/update-text.dto';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class TextService {

  constructor(private prisma: PrismaService) {}
  create(data: CreateTextDto) {
    console.log(data.rpgGameId)
    return this.prisma.text.create({
      data:{
        text: data.text,
        author: data.author,
        dateH: data.dateH,
        rpgGameId: data.rpgGameId,
        userId: data.authorId
      }
    });
  }

  findAll() {
    return `This action returns all text`;
  }

  findOne(id: number) {
    return `This action returns a #${id} text`;
  }

  update(id: number, updateTextDto: UpdateTextDto) {
    return `This action updates a #${id} text`;
  }

  remove(id: number) {
    return `This action removes a #${id} text`;
  }
}
