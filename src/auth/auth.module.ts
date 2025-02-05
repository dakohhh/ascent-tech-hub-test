import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { AuthService } from "./auth.service";
import { MailModule } from "src/mail/mail.module";
import { AuthController } from "./auth.controller";
import { TokenModule } from "src/token/token.module";
import { UsersModule } from "src/users/users.module";
import { User, UserSchema } from "src/users/user.schema";
import { JwtStrategy } from "./strategies/jwt.strategy";

import { LocalStrategy } from "./strategies/local.strategy";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";
import { MongooseModule } from "@nestjs/mongoose";
import { ProfileModule } from "src/profile/profile.module";
import { PaystackModule } from "src/paystack/paystack.module";
import { DvaModule } from "src/dva/dva.module";
import { DVA, DVASchema } from "src/dva/dva.schemas";
// import { GoogleStrategy } from "./strategies/google.strategy";
// import { AppleStrategy } from "./strategies/apple.strategy";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: DVA.name, schema: DVASchema },
    ]),
    PassportModule,
    TokenModule,
    UsersModule,
    MailModule,
    ProfileModule,
    PaystackModule,
    DvaModule,
  ],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
