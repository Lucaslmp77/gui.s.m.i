import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserDTO } from "./user.dto";
import { hash } from "bcryptjs";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async create(data: UserDTO) {
        const UserWithSameEmail = await this.prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });
        if (UserWithSameEmail) {
            throw new ConflictException(
                "Já existe um usuário com o mesmo endereço de e-mail.",
            );
        }

        const hashedPassword = await hash(data.password, 8);

        await this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
            },
        });
    }
}