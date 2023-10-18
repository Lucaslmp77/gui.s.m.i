import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { GameRuleController } from "./game-rule.controller";
import { GameRuleService } from "./game-rule.service";

@Module({
  controllers: [GameRuleController],
  providers: [PrismaService, GameRuleService],
})
export class GameRuleModule {}
