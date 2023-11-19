import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { RpgGameDTO } from "./rpg-game.dto";
import { CurrentUser } from "src/auth/current-user-decorator";
import { UserPayload } from "src/auth/jwt.strategy";
import {PlayerDTO} from "./player.dto";

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

  async findUnique(id: string) {
    return this.prisma.rpgGame.findUnique({
      where: {id: id}
    })
    
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

  async savePlayerInGame( rpgGameId: string, idPlayer: string, namePlayer: string): Promise<PlayerDTO> {
    const rpgGame = await this.prisma.rpgGame.findUnique({
      where: { id: rpgGameId },
    });

    if (!rpgGame) {
      throw new Error('A sala não foi encontrada');
    }

    const player: PlayerDTO = await this.prisma.player.create({
      data: {
        idPlayer,
        namePlayer,
        rpgGame: { connect: { id: rpgGameId } },
      },
      include: {
        rpgGame: true,
      },
    });

    return player;
  }


  async getPlayersInGame(rpgGameId: string): Promise<PlayerDTO[]> {
    const playersInGame = await this.prisma.player.findMany({
      where: { rpgGameId },
      include: {
        rpgGame: true,
      },
    });

    const playersDTO: PlayerDTO[] = playersInGame.map((player) => ({
      id: player.id,
      idPlayer: player.idPlayer,
      namePlayer: player.namePlayer,
      rpgGame: {
        id: player.rpgGame.id,
      },
    }));

    return playersDTO;
  }

  async deletePlayerFromGame(playerId: string): Promise<void> {
    await this.prisma.player.delete({
      where: { id: playerId },
    });
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

  async removePlayerFromGame(rpgGameId: string, userId: string): Promise<void> {
    const isUserInGame = await this.prisma.player.findFirst({
      where: {
        rpgGameId,
        idPlayer: userId,
      },
    });

    if (!isUserInGame) {
      throw new Error('O jogador não está na sala');
    }

    await this.prisma.player.delete({
      where: {
        id: isUserInGame.id,
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
