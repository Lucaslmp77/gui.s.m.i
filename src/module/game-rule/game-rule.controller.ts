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
  UseGuards,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "src/auth/current-user-decorator";
import { UserPayload } from "src/auth/jwt.strategy";

const gameRuleBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  rpgGameId: z.string(),
});

const validationPipe = new ZodValidationPipe(gameRuleBodySchema);

type GameRuleBodySchema = z.infer<typeof gameRuleBodySchema>;

@Controller("api/game-rule")
@UseGuards(AuthGuard("jwt"))
export class GameRuleController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body(validationPipe) body: GameRuleBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { rpgGameId, name, description } = body;

    const gameRule = await this.prisma.gameRule.create({
      data: {
        name,
        description,
        rpgGameId,
      },
    });

    return gameRule;
  }

  @Get()
  async findMany() {
    return this.prisma.gameRule.findMany();
  }

  @Get(":id")
  async findUnique(@Param("id") id: string) {
    const gameRule = await this.prisma.gameRule.findUnique({
      where: { id: id },
    });

    if (!gameRule) {
      throw new NotFoundException("Regra do jogo não encontrada");
    }

    return gameRule;
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body(validationPipe) body: GameRuleBodySchema,
  ) {
    const { rpgGameId, name, description } = body;

    const existingGameRule = await this.prisma.gameRule.findUnique({
      where: { id: id },
    });

    if (!existingGameRule) {
      throw new NotFoundException("Regra do jogo não encontrada");
    }

    const updatedGameRule = await this.prisma.gameRule.update({
      where: { id: id },
      data: {
        name,
        description,
        rpgGameId,
      },
    });

    return updatedGameRule;
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    const existingGameRule = await this.prisma.gameRule.findUnique({
      where: { id: id },
    });

    if (!existingGameRule) {
      throw new NotFoundException("Regra do jogo não encontrada");
    }

    await this.prisma.gameRule.delete({
      where: { id: id },
    });

    return { message: "Regra do jogo excluída com sucesso" };
  }
}
