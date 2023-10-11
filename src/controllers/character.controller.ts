import { Body, Controller, HttpCode, Post, UseGuards, UsePipes } from "@nestjs/common"
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
    constructor(private prisma: PrismaService) {}

    @Post()
    @HttpCode(201)
    async handle(
        @Body(validationPipe) body: CharacterBodySchema,
        @CurrentUser() user: UserPayload,
        ) {
        const {name, race, group, level, attributes, abilities } = body
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
    }
}