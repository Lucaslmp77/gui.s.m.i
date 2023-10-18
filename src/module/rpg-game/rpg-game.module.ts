import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { RpgGameController } from "./rpg-game.controller";
import { RpgGameService } from "./rpg-game.service";

@Module({
  controllers: [RpgGameController],
  providers: [PrismaService, RpgGameService],
})
export class RpgGameModule {}
