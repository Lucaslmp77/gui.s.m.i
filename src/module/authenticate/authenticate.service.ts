import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthenticateDTO } from "./authenticate.dto";
import { compare } from "bcryptjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthenticateService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async authenticate(data: AuthenticateDTO) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        "A credencial do usuário não corresponde.",
      );
    }

    const isPasswordValid = await compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        "A credencial do usuário não corresponde.",
      );
    }

    const accessToken = this.jwt.sign({ sub: user.id });

    return {
      access_token: accessToken,
    };
  }
}
