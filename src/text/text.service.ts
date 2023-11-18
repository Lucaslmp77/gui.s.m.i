import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateTextDto } from './dto/create-text.dto';
import { UpdateTextDto } from './dto/update-text.dto';
import {PrismaService} from "../prisma/prisma.service";
import {CurrentUser} from "../auth/current-user-decorator";
import {UserPayload} from "../auth/jwt.strategy";

interface TextSearchCondition {
  rpgGameId: string;
  dateH?: {
    gte: Date;
    lte: Date;
  };
}
@Injectable()
export class TextService {


  constructor(private prisma: PrismaService) {}
  create(data: CreateTextDto) {
    console.log(data)
    return this.prisma.text.create({
      data:{
        text: data.text,
        author: data.author,
        dateH: data.dateH,
        rpgGameId: data.rpgGameId,
        userId: data.userId
      }
    });
  }

  findAll() {
    return this.prisma.text.findMany();
  }

  async findMany(condition: TextSearchCondition) {
    const text = await this.prisma.text.findMany({
      where: condition,
    });

    if (!text) {
      throw new NotFoundException("mensagem não encontrado");
    }

    return text;
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
