import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { GameRuleDTO } from "./game-rule.dto";

@Injectable()
export class GameRuleService {
    constructor(private prisma: PrismaService) { }

    async create(
        data: GameRuleDTO
    ) {
        return this.prisma.gameRule.create({
            data,
        });
    }

    async findAll() {
        return this.prisma.gameRule.findMany();
    }

    async findUnique(id: string) {
        const gameRule = await this.prisma.gameRule.findUnique({
            where: { id: id },
        });

        if (!gameRule) {
            throw new NotFoundException("Regra do jogo não encontrada");
        }

        return gameRule;
    }

    async update(
        id: string,
        data: GameRuleDTO,
    ) {
        const existingGameRule = await this.prisma.gameRule.findUnique({
            where: { id: id },
        });

        if (!existingGameRule) {
            throw new NotFoundException("Regra do jogo não encontrada");
        }

        return this.prisma.gameRule.update({
            where: { id: id },
            data,
        });
    }

    async delete(id: string) {
        const existingGameRule = await this.prisma.gameRule.findUnique({
            where: { id: id },
        });

        if (!existingGameRule) {
            throw new NotFoundException("Regra do jogo não encontrada");
        }

        await this.prisma.gameRule.delete({
            where: { id: id },
        });
    }
}
