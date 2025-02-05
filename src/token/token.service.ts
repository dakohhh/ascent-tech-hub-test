import crypto from "crypto";
import bcryptjs from "bcryptjs";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { User } from "src/users/user.schema";
import { Token, TokenType } from "./schemas/token.schema";

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(Token.name)
    private readonly tokenModel: Model<Token>
  ) {}

  async decodeJWTToken(token: string) {
    try {
      return this.jwtService.verify(token, { secret: this.configService.get("CONFIGS.JWT_SECRET") });
    } catch (error) {
      return null;
    }
  }

  async generateAuthTokens(user: User) {
    // Generate random refresh-token and hash it
    const refreshToken = crypto.randomBytes(32).toString("hex");

    // encrypt refresh-token
    const hashedRefreshToken = await bcryptjs.hash(refreshToken, parseInt(this.configService.get("CONFIGS.BCRYPT_SALT")));

    // Save refresh-token in database
    await new this.tokenModel({
      user: user,
      token: hashedRefreshToken,
      type: TokenType.REFRESH_TOKEN,
      expires_at: new Date(Date.now() + parseInt(this.configService.get("CONFIGS.REFRESH_TOKEN_JWT_EXPIRES_IN"))),
    }).save();

    // Generate access token and refresh-token JWT
    const accessTokenJWT = this.jwtService.sign({ sub: user._id }, { secret: this.configService.get("CONFIGS.JWT_SECRET"), expiresIn: this.configService.get("CONFIGS.ACCESS_TOKEN_JWT_EXPIRES_IN") / 1000 });
    const refreshTokenJWT = this.jwtService.sign({ sub: user._id, refresh_token: refreshToken }, { secret: this.configService.get("CONFIGS.JWT_SECRET"), expiresIn: this.configService.get("CONFIGS.REFRESH_TOKEN_JWT_EXPIRES_IN") / 1000 });

    return { access_token: accessTokenJWT, refresh_token: refreshTokenJWT };
  }

  async refreshAuthTokens(user: User, refreshToken: string) {
    // Find refresh-tokens for user in database
    const refreshTokens = await this.tokenModel.find({ user, type: TokenType.REFRESH_TOKEN });
    if (refreshTokens.length === 0) throw new HttpException("Invalid or expired token", HttpStatus.UNAUTHORIZED);

    // for each refresh-token, check if it matches the decoded refresh-token
    for (const singleToken of refreshTokens) {
      const isValid = await bcryptjs.compare(refreshToken, String(singleToken.token));

      if (isValid === true) {
        // Delete the previous refresh-token from database
        await this.tokenModel.findByIdAndDelete(singleToken._id);

        // Check if refresh-token is expired, if yes, throw error
        if (new Date() > singleToken.expires_at) {
          throw new HttpException("Invalid or expired token", HttpStatus.UNAUTHORIZED);
        }

        // Generate new access token and refresh-token JWT
        return await this.generateAuthTokens(user);
      }
    }

    throw new HttpException("Invalid or expired token", HttpStatus.UNAUTHORIZED);
  }

  async revokeRefreshToken(user: User, refreshToken: string) {
    // Find refresh-tokens for user in database
    const refreshTokens = await this.tokenModel.find({ user, type: TokenType.REFRESH_TOKEN });

    // for each refresh-token, check if it matches the decoded refresh-token
    for (const singleToken of refreshTokens) {
      const isValid = await bcryptjs.compare(refreshToken, String(singleToken.token));

      if (isValid === true) {
        // Delete the refresh-token
        await this.tokenModel.findByIdAndDelete(singleToken._id);

        return true;
      }
    }

    return false;
  }

  async generateOtpToken({ user, tokenType }: { user: User; tokenType: Exclude<TokenType, "refresh-token"> }) {
    // find and delete any existing token of the same type
    await this.tokenModel.findOneAndDelete({ user, type: tokenType });

    // generate random code and token
    const token = crypto.randomBytes(32).toString("hex");
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    // encrypt the generated code and token
    const hashedCode = await bcryptjs.hash(code, parseInt(this.configService.get("CONFIGS.BCRYPT_SALT")));
    const hashedToken = await bcryptjs.hash(token, parseInt(this.configService.get("CONFIGS.BCRYPT_SALT")));

    // save the encrypted code and token in database
    await new this.tokenModel({
      user,
      type: tokenType,
      code: hashedCode,
      token: hashedToken,
      expires_at: new Date(Date.now() + parseInt(this.configService.get("CONFIGS.DEFAULT_DB_TOKEN_EXPIRY_DURATION"))),
    }).save();

    // return the unencrypted code and token
    return { code, token };
  }

  async verifyOtpToken({ code, token, user, tokenType, deleteIfValidated }: { code?: string; token?: string; user: User; tokenType: Exclude<TokenType, "refresh-token">; deleteIfValidated: boolean }) {
    // Find token in database
    const dbToken = await this.tokenModel.findOne({ user, type: tokenType });

    // check if token is expired
    if (new Date() > dbToken.expires_at) {
      await this.tokenModel.findOneAndDelete({ user, type: tokenType });
      return false;
    }

    // If no token found, return false
    if (!dbToken) return false;

    // Check if code and token matches
    const isCodeValid = await bcryptjs.compare(String(code), String(dbToken.code));
    const isTokenValid = await bcryptjs.compare(String(token), String(dbToken.token));

    // If code and token is invalid, return false
    if (isCodeValid !== true && isTokenValid !== true) return false;

    if (deleteIfValidated === true) {
      // If code and token is valid, delete the token
      await this.tokenModel.findOneAndDelete({ user, type: tokenType });
    }

    return true;
  }
}
