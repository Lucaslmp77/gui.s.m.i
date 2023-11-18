import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { RpgGameDTO } from "./rpg-game.dto";
import { CurrentUser } from "src/auth/current-user-decorator";
import { UserPayload } from "src/auth/jwt.strategy";

@Injectable()
export class RpgGameService {
  constructor(private prisma: PrismaService) { }

  async create(data: RpgGameDTO, @CurrentUser() user: UserPayload) {
    const authorId = user.sub;

    return this.prisma.rpgGame.create({
      data: {
        userId: authorId,
        name: data.name,
        description: data.description
      },
    });
  }

  async countAllRpgGame() {
    return await this.prisma.rpgGame.count();
  }

  async countRpgGameByUser(userId: string) {
    return await this.prisma.rpgGame.count({
      where: {
        userId: userId,
      },
    });
  }

  async findAll(page: number = 1) {
    const pageSize: number = 4;
    const skip = (page - 1) * pageSize;
    const rpgGames = await this.prisma.rpgGame.findMany({
      skip: skip,
      take: pageSize,
      include: {
        user: true
      }
    });
    return rpgGames
  }

  async findRpgByUser(userId: string, page: number = 1) {
    const pageSize: number = 4;
    const skip = (page - 1) * pageSize;

    const rpgGames = await this.prisma.rpgGame.findMany({
      where: {
        userId: userId,
      },
      skip: skip,
      take: pageSize,
      include: {
        user: true
      }
    });

    return rpgGames;
  }


  async findUnique(id: string) {
    const rpgGame = await this.prisma.rpgGame.findUnique({
      where: { id: id },
    });

    if (!rpgGame) {
      throw new NotFoundException("Jogo de RPG não encontrado");
    }

    return rpgGame;
  }

  async update(id: string, data: RpgGameDTO, @CurrentUser() user: UserPayload) {
    const authorId = user.sub;

    const existingRpgGame = await this.prisma.rpgGame.findUnique({
      where: { id: id },
    });

    if (!existingRpgGame) {
      throw new NotFoundException("Jogo de RPG não encontrado");
    }

    if (existingRpgGame.userId !== authorId) {
      throw new UnauthorizedException(
        "Você não tem permissão para atualizar este jogo",
      );
    }

    return this.prisma.rpgGame.update({
      where: { id: id },
      data: {
        name: data.name,
        description: data.description
      },
    });
  }

  async delete(id: string, @CurrentUser() user: UserPayload) {
    const authorId = user.sub;

    const existingRpgGame = await this.prisma.rpgGame.findUnique({
      where: { id: id },
    });

    if (!existingRpgGame) {
      throw new NotFoundException("Jogo de RPG não encontrado");
    }

    if (existingRpgGame.userId !== authorId) {
      throw new UnauthorizedException(
        "Você não tem permissão para deletar este jogo",
      );
    }

    return this.prisma.rpgGame.delete({
      where: { id: id },
    });
  }
}
