// import { Injectable, Logger } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { PassportStrategy } from "@nestjs/passport";
// import { Strategy, Profile } from "@arendajaelu/nestjs-passport-apple";
// import { User } from "src/users/user.schema";

// @Injectable()
// export class AppleStrategy extends PassportStrategy(Strategy, "apple") {
//   private readonly logger = new Logger(AppleStrategy.name);
//   constructor(private readonly configService: ConfigService) {
//     super({
//       clientID: configService.get("CONFIGS.APPLE.CLIENT_ID"),
//       teamID: configService.get("CONFIGS.APPLE.TEAM_ID"),
//       callbackURL: configService.get("CONFIGS.APPLE.CALLBACK_URL"),
//       keyID: configService.get("CONFIGS.APPLE.KEY_ID"),
//       key: configService.get("CONFIGS.APPLE.PRIVATE_KEY"),
//       scope: ["email", "name"],
//       passReqToCallback: false,
//     });
//   }

//   async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
//     const { id, email, emailVerified, name, provider } = profile;
//     const user = {
//       provider,
//       provider_id: id,
//       email_verified: emailVerified,
//       email,
//       name: name && name.firstName && name.lastName ? `${name.firstName} ${name.lastName}` : null,
//     } as User;

//     this.logger.debug(`Apple user: ${JSON.stringify(user)}`);
//     return user;
//   }
// }
