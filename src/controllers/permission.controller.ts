import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, UseGuards } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { z } from 'zod'
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe"
import { AuthGuard } from "@nestjs/passport"

const permissionBodySchema = z.object({
    name: z.string(),
    description: z.string(),
})

const validationPipe = new ZodValidationPipe(permissionBodySchema)

type PermissionBodySchema = z.infer<typeof permissionBodySchema>

@Controller('api/permission')
@UseGuards(AuthGuard('jwt'))
export class PermissionController {
    constructor(private prisma: PrismaService) { }

    @Post()
    @HttpCode(201)
    async create(
        @Body(validationPipe) body: PermissionBodySchema
    ) {
        const permission = await this.prisma.permission.create({
            data: {
                ...body,
                rpgGame: {
                    connect: {
                        id: 'ID_DO_RPG_GAME',
                    },
                },
            },
        });

        return permission;
    }

    @Get()
    async findMany() {
        return this.prisma.permission.findMany()
    }

    @Get(':id')
    async findUnique(@Param('id') id: string) {
        const permission = await this.prisma.permission.findUnique({
            where: { id: id },
        });

        if (!permission) {
            throw new NotFoundException('Permissão não encontrada')
        }

        return permission
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body(validationPipe) body: PermissionBodySchema
    ) {
        const existingPermission = await this.prisma.permission.findUnique({
            where: { id: id },
        });

        if (!existingPermission) {
            throw new NotFoundException('Permissão não encontrada')
        }

        const updatedPermission = await this.prisma.permission.update({
            where: { id: id },
            data: {
                ...body,
            },
        });

        return updatedPermission
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        const existingPermission = await this.prisma.permission.findUnique({
            where: { id: id },
        });

        if (!existingPermission) {
            throw new NotFoundException('Permissão não encontrada')
        }

        await this.prisma.permission.delete({
            where: { id: id },
        });

        return { message: 'Permissão excluída com sucesso' }
    }
}
