import {
  Body,
  Controller,
  Post,
} from "@nestjs/common";
import { AuthenticateService } from "./authenticate.service";
import { AuthenticateDTO } from "./authenticate.dto";

@Controller("api/sessions")
export class AuthenticateController {
  constructor(
    private authenticateService: AuthenticateService,
  ) { }

  @Post()
  async authenticate(@Body() data: AuthenticateDTO) {
    return this.authenticateService.authenticate(data);
  }
}