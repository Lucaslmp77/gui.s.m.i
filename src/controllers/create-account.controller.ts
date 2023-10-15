import { Body, ConflictException, Controller, HttpCode, Post, UsePipes } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { hash } from "bcryptjs"
import { z } from 'zod'
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe"

const createAccountBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('api/accounts')
export class CreateAccountsController {
    constructor(private prisma: PrismaService) {}

    @Post()
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(createAccountBodySchema))
    async create(@Body() body: CreateAccountBodySchema) {
        const {name, email, password} = body

        const UserWithSameEmail = await this.prisma.user.findUnique({
            where: {
                email,
            },
        })
        if(UserWithSameEmail) {
            throw new ConflictException('Já existe um usuário com o mesmo endereço de e-mail.')
        }

        const hashedPassword = await hash(password, 8)

        await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })
    }
}