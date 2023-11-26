import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { OtpController } from "./otp.controller";
import { OtpService } from "./otp.service";

@Module({
  controllers: [OtpController],
  providers: [PrismaService, OtpService],
})
export class OtpModule {}
