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
import { AuthGuard } from "@nestjs/passport";
import { GameRuleService } from "./game-rule.service";
import { GameRuleDTO } from "./game-rule.dto";

@Controller("api/game-rule")
@UseGuards(AuthGuard("jwt"))
export class GameRuleController {
  constructor(private gameRuleService: GameRuleService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() data: GameRuleDTO) {
    return this.gameRuleService.create(data);
  }

  @Get()
  async findAll() {
    return this.gameRuleService.findAll();
  }

  @Get(":id")
  async findUnique(@Param("id") id: string) {
    const gameRule = await this.gameRuleService.findUnique(id);

    if (!gameRule) {
      throw new NotFoundException("Regra do jogo não encontrada");
    }
    return gameRule;
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() data: GameRuleDTO) {
    const existingGameRule = await this.gameRuleService.findUnique(id);

    if (!existingGameRule) {
      throw new NotFoundException("Regra do jogo não encontrada");
    }

    return this.gameRuleService.update(id, data);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    const existingGameRule = await this.gameRuleService.findUnique(id);

    if (!existingGameRule) {
      throw new NotFoundException("Regra do jogo não encontrada");
    }

    return this.gameRuleService.delete(id);
  }
}
