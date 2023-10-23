import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CurrentUser } from "src/auth/current-user-decorator";
import { PrismaService } from "src/prisma/prisma.service";
import { CharacterDTO } from "./character.dto";
import { UserPayload } from "src/auth/jwt.strategy";

@Injectable()
export class CharacterService {
  constructor(private prisma: PrismaService) {}

  async create(data: CharacterDTO, @CurrentUser() user: UserPayload) {
    const authorId = user.sub;

    await this.prisma.character.create({
      data: {
        userId: authorId,
        name: data.name,
        race: data.race,
        group: data.group,
        level: data.level,
        attributes: data.attributes,
        abilities: data.abilities,
      },
    });
  }

  async findAll() {
    return this.prisma.character.findMany();
  }

  async findUnique(id: string) {
    const character = await this.prisma.character.findUnique({
      where: { id: id },
    });

    if (!character) {
      throw new NotFoundException("Personagem não encontrado");
    }

    return character;
  }

  async update(
    id: string,
    data: CharacterDTO,
    @CurrentUser() user: UserPayload,
  ) {
    const authorId = user.sub;

    const existingCharacter = await this.prisma.character.findUnique({
      where: { id: id },
    });

    if (!existingCharacter) {
      throw new NotFoundException("Personagem não encontrado");
    }

    if (existingCharacter.userId !== authorId) {
      throw new UnauthorizedException(
        "Você não tem permissão para atualizar este personagem",
      );
    }

    await this.prisma.character.update({
      where: { id: id },
      data,
    });
  }

  async delete(id: string, @CurrentUser() user: UserPayload) {
    const authorId = user.sub;

    const existingCharacter = await this.prisma.character.findUnique({
      where: { id: id },
    });

    if (!existingCharacter) {
      throw new NotFoundException("Personagem não encontrado");
    }

    if (existingCharacter.userId !== authorId) {
      throw new UnauthorizedException(
        "Você não tem permissão para excluir este personagem",
      );
    }

    await this.prisma.character.delete({
      where: { id: id },
    });
  }
}
