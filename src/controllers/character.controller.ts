import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, UnauthorizedException, UseGuards, UsePipes } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { z } from 'zod'
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe"
import { AuthGuard } from "@nestjs/passport"
import { CurrentUser } from "src/auth/current-user-decorator"
import { UserPayload } from "src/auth/jwt.strategy"

const characterBodySchema = z.object({
    name: z.string(),
    race: z.string(),
    group: z.string(),
    level: z.number(),
    attributes: z.string(),
    abilities: z.string(),
})

const validationPipe = new ZodValidationPipe(characterBodySchema)

type CharacterBodySchema = z.infer<typeof characterBodySchema>

@Controller('api/character')
@UseGuards(AuthGuard('jwt'))
export class CharacterController {
    constructor(private prisma: PrismaService) { }

    @Post()
    @HttpCode(201)
    async create(
        @Body(validationPipe) body: CharacterBodySchema,
        @CurrentUser() user: UserPayload,
    ) {
        const { name, race, group, level, attributes, abilities } = body
        const authorId = user.sub

        await this.prisma.character.create({
            data: {
                userId: authorId,
                name,
                race,
                group,
                level,
                attributes,
                abilities,
            },
        })

        return { message: 'Personagem criado com sucesso' };
    }

    @Get()
    async findAll() {
        return this.prisma.character.findMany()
    }

    @Get(':id')
    async findUnique(@Param('id') id: string) {
        const character = await this.prisma.character.findUnique({
            where: { id: id },
        });

        if (!character) {
            throw new NotFoundException('Personagem não encontrado');
        }

        return character;
    }


    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body(validationPipe) body: CharacterBodySchema,
        @CurrentUser() user: UserPayload,
    ) {
        const { name, race, group, level, attributes, abilities } = body;
        const authorId = user.sub;

        const existingCharacter = await this.prisma.character.findUnique({
            where: { id: id },
        });

        if (!existingCharacter) {
            throw new NotFoundException('Personagem não encontrado');
        }

        if (existingCharacter.userId !== authorId) {
            throw new UnauthorizedException('Você não tem permissão para atualizar este personagem');
        }

        await this.prisma.character.update({
            where: { id: id },
            data: {
                name,
                race,
                group,
                level,
                attributes,
                abilities,
            },
        });

        return { message: 'Personagem atualizado com sucesso' };
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @CurrentUser() user: UserPayload) {
        const authorId = user.sub;

        const existingCharacter = await this.prisma.character.findUnique({
            where: { id: id },
        });

        if (!existingCharacter) {
            throw new NotFoundException('Personagem não encontrado');
        }

        if (existingCharacter.userId !== authorId) {
            throw new UnauthorizedException('Você não tem permissão para excluir este personagem');
        }

        await this.prisma.character.delete({
            where: { id: id },
        });

        return { message: 'Personagem excluído com sucesso' };
    }
}