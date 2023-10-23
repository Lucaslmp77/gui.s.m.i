import { Module } from "@nestjs/common";
import { PermissionController } from "./permission.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { PermissionService } from "./permission.service";

@Module({
  controllers: [PermissionController],
  providers: [PrismaService, PermissionService],
})
export class PermissionModule {}
