import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";

import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(
    config: ConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: config.get("CONFIGS.JWT_SECRET"),
      jwtFromRequest: ExtractJwt.fromBodyField("refresh_token"),
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.getUserById(payload.sub);
    return { user, token: payload.refresh_token };
  }
}
