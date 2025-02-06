import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { User } from "src/users/user.schema";
import { TokenService } from "src/token/token.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";
import { HttpResponse } from "src/common/dto/http-response.dto";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthTokensDto, RefreshTokenDto, AuthenticationResponseDto } from "./dto/auth.dto";
import { Body, Request, Controller, Post, UseGuards, HttpStatus, HttpCode } from "@nestjs/common";
import { ApiHttpErrorResponses, ApiHttpResponse } from "src/common/decorators/custom-decorator";

@ApiTags("Authentication")
@Controller({ path: "api/auth" })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService
  ) {}

  @ApiOperation({ summary: "Register" })
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: 201, type: AuthenticationResponseDto, description: "Registers a new user" })
  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return new HttpResponse("User registered", result, HttpStatus.CREATED);
  }

  @ApiOperation({ summary: "Login" })
  @ApiHttpErrorResponses()
  @ApiBody({ type: LoginDto })
  @ApiHttpResponse({ status: 200, type: AuthenticationResponseDto, description: "Logs in a user" })
  @HttpCode(200)
  @Post("login")
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: Request & { user: User }) {
    const result = await this.authService.login(req.user);
    return new HttpResponse("User logged in", result, HttpStatus.OK);
  }

  @ApiOperation({ summary: "Refresh Tokens" })
  @ApiHttpErrorResponses()
  @ApiBody({ type: RefreshTokenDto })
  @ApiHttpResponse({ status: 200, type: AuthTokensDto, description: "Refreshes the access token and refresh token" })
  @HttpCode(200)
  @Post("refresh-tokens")
  @UseGuards(JwtRefreshGuard)
  async refreshTokens(@Request() req: Request & { user: { user: User; token: string } }) {
    const result = await this.tokenService.refreshAuthTokens(req.user.user, req.user.token);
    return new HttpResponse("Tokens refreshed", result, HttpStatus.OK);
  }

  @ApiOperation({ summary: "Logout" })
  @ApiHttpErrorResponses()
  @ApiBody({ type: RefreshTokenDto })
  @ApiHttpResponse({ status: 200, type: Boolean, description: "Logs out a user, by revoking the refresh token" })
  @HttpCode(200)
  @Post("logout")
  @UseGuards(JwtRefreshGuard)
  async logout(@Request() req: Request & { user: { user: User; token: string } }) {
    const result = await this.tokenService.revokeRefreshToken(req.user.user, req.user.token);
    return new HttpResponse("User logged out", result, HttpStatus.OK);
  }
}
