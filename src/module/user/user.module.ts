import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "./user.service";
import { OtpService } from "../otp/otp.service";

@Module({
  controllers: [UserController],
  providers: [PrismaService, UserService, OtpService],
})
export class UserModule { }
