import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { UserDTO } from "./user.dto";
import { UserService } from "./user.service";

@Controller("api/accounts")
export class UserController {
  constructor(private userService: UserService) { }

  @Post()
  @HttpCode(201)
  async create(@Body() data: UserDTO) {
    return this.userService.create(data);
  }

  @Get(":email")
  async findUserByEmail(@Param("email") email: string) {
    return this.userService.findUserByEmail(email);
  }
}
