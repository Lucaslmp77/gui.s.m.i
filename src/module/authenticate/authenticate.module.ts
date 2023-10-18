import { Module } from "@nestjs/common";
import { AuthenticateController } from "./authenticate.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthenticateService } from "./authenticate.service";

@Module({
    controllers: [AuthenticateController],
    providers: [PrismaService, AuthenticateService],
})
export class AuthenticateModule { }