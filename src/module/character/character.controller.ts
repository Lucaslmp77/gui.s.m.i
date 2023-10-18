import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "src/auth/current-user-decorator";
import { UserPayload } from "src/auth/jwt.strategy";
import { CharacterDTO } from "./character.dto";
import { CharacterService } from "./character.service";

@Controller("api/character")
@UseGuards(AuthGuard("jwt"))
export class CharacterController {
  constructor(private characterService: CharacterService) { }

  @Post()
  @HttpCode(201)
  async create(
    @Body() data: CharacterDTO,
    @CurrentUser() user: UserPayload,
  ) {
    return this.characterService.create(data, user);
  }

  @Get()
  async findAll() {
    return this.characterService.findAll();
  }

  @Get(":id")
  async findUnique(@Param("id") id: string) {
    return this.characterService.findUnique(id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() data: CharacterDTO,
    @CurrentUser() user: UserPayload,
  ) {
    const authorId = user.sub;

    const existingCharacter = await this.characterService.findUnique(id);

    if (!existingCharacter) {
      throw new NotFoundException("Personagem não encontrado");
    }

    if (existingCharacter.userId !== authorId) {
      throw new UnauthorizedException(
        "Você não tem permissão para atualizar este personagem",
      );
    }

    return this.characterService.update(id, data, user);
  }

  @Delete(":id")
  async delete(@Param("id") id: string, @CurrentUser() user: UserPayload) {
    const authorId = user.sub;

    const existingCharacter = await this.characterService.findUnique(id);

    if (!existingCharacter) {
      throw new NotFoundException("Personagem não encontrado");
    }

    if (existingCharacter.userId !== authorId) {
      throw new UnauthorizedException(
        "Você não tem permissão para excluir este personagem",
      );
    }

    return this.characterService.delete(id, user);
  }
}
