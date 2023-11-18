import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "src/auth/current-user-decorator";
import { UserPayload } from "src/auth/jwt.strategy";
import { RpgGameDTO } from "./rpg-game.dto";
import { RpgGameService } from "./rpg-game.service";

@Controller("api/rpg-game")
@UseGuards(AuthGuard("jwt"))
export class RpgGameController {
  constructor(private rpgGameService: RpgGameService) { }

  @Post()
  @HttpCode(201)
  async create(@Body() data: RpgGameDTO, @CurrentUser() user: UserPayload) {
    return this.rpgGameService.create(data, user);
  }

  @Get("/countAllRpgGame")
  async countAllRpgGame(
  ) {
    return this.rpgGameService.countAllRpgGame();
  }

  @Get("/countRpgGameByUser/:userId")
  async countRpgGameByUser(
    @Param("userId") userId: string,
  ) {
    return this.rpgGameService.countRpgGameByUser(userId);
  }

  @Get("")
  async findAll(
    @Query('page') page?: number
  ) {
    return this.rpgGameService.findAll(page);
  }

  @Get("/findRpgByUser/:id")
  async findRpgByUser(
    @Param("id") id: string,
    @Query('page') page?: number
  ) {
    return this.rpgGameService.findRpgByUser(id, page);
  }

  @Get(":id")
  async findUnique(@Param("id") id: string) {
    return this.rpgGameService.findUnique(id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() data: RpgGameDTO,
    @CurrentUser() user: UserPayload,
  ) {
    return this.rpgGameService.update(id, data, user);
  }

  @Delete(":id")
  async delete(@Param("id") id: string, @CurrentUser() user: UserPayload) {
    return this.rpgGameService.delete(id, user);
  }
}
