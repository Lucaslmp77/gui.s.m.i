import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PermissionDTO } from "./permission.dto";

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async create(data: PermissionDTO) {
    return this.prisma.permission.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.permission.findMany();
  }

  async findUnique(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id: id },
    });

    if (!permission) {
      throw new NotFoundException("Permissão não encontrada");
    }

    return permission;
  }

  async update(id: string, data: PermissionDTO) {
    const existingPermission = await this.prisma.permission.findUnique({
      where: { id: id },
    });

    if (!existingPermission) {
      throw new NotFoundException("Permissão não encontrada");
    }

    return this.prisma.permission.update({
      where: { id: id },
      data,
    });
  }

  async delete(id: string) {
    const existingPermission = await this.prisma.permission.findUnique({
      where: { id: id },
    });

    if (!existingPermission) {
      throw new NotFoundException("Permissão não encontrada");
    }

    return this.prisma.permission.delete({
      where: { id: id },
    });
  }
}
