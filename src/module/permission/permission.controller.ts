import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PermissionService } from "./permission.service";
import { PermissionDTO } from "./permission.dto";

@Controller("api/permission")
@UseGuards(AuthGuard("jwt"))
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() data: PermissionDTO) {
    return this.permissionService.create(data);
  }

  @Get()
  async findMany() {
    return this.permissionService.findAll();
  }

  @Get(":id")
  async findUnique(@Param("id") id: string) {
    return this.permissionService.findUnique(id);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() data: PermissionDTO) {
    const existingPermission = await this.permissionService.findUnique(id);

    if (!existingPermission) {
      throw new NotFoundException("Permissão não encontrada");
    }

    return this.permissionService.update(id, data);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    const existingPermission = await this.permissionService.findUnique(id);

    if (!existingPermission) {
      throw new NotFoundException("Permissão não encontrada");
    }

    return this.permissionService.delete(id);
  }
}
