import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, UseGuards } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { z } from 'zod'
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe"
import { AuthGuard } from "@nestjs/passport"
import { CurrentUser } from "src/auth/current-user-decorator"
import { UserPayload } from "src/auth/jwt.strategy"

const rpgGameBodySchema = z.object({
    name: z.string(),
    description: z.string(),
})

const validationPipe = new ZodValidationPipe(rpgGameBodySchema)

type RpgGameBodySchema = z.infer<typeof rpgGameBodySchema>

@Controller('api/rpg-game')
@UseGuards(AuthGuard('jwt'))
export class RpgGameController {
    constructor(private prisma: PrismaService) { }

    @Post()
    @HttpCode(201)
    async create(
        @Body(validationPipe) body: RpgGameBodySchema,
        @CurrentUser() user: UserPayload,
    ) {
        const { name, description } = body
        const authorId = user.sub

        const createdRpgGame = await this.prisma.rpgGame.create({
            data: {
                userId: authorId,
                name,
                description,
            },
        })

        return { message: 'Jogo criado com sucesso', rpgGame: createdRpgGame }
    }

    @Get()
    async findMany() {
        const rpgGames = await this.prisma.rpgGame.findMany()
        return rpgGames
    }

    @Get(':id')
    async findUnique(@Param('id') id: string) {
        const rpgGame = await this.prisma.rpgGame.findUnique({
            where: { id: id },
        });

        if (!rpgGame) {
            throw new NotFoundException('Jogo de RPG não encontrado')
        }

        return rpgGame
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body(validationPipe) body: RpgGameBodySchema,
        @CurrentUser() user: UserPayload,
    ) {
        const authorId = user.sub;

        const existingRpgGame = await this.prisma.rpgGame.findUnique({
            where: { id: id },
        });

        if (!existingRpgGame) {
            throw new NotFoundException('Jogo de RPG não encontrado')
        }

        const updatedRpgGame = await this.prisma.rpgGame.update({
            where: { id: id },
            data: body,
        });

        return updatedRpgGame;
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @CurrentUser() user: UserPayload) {
        const authorId = user.sub

        const existingRpgGame = await this.prisma.rpgGame.findUnique({
            where: { id: id },
        });

        if (!existingRpgGame) {
            throw new NotFoundException('Jogo de RPG não encontrado')
        }

        await this.prisma.rpgGame.delete({
            where: { id: id },
        });

        return { message: 'Jogo de RPG excluído com sucesso' }
    }
}
