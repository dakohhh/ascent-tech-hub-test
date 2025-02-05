// import { Injectable } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { PassportStrategy } from "@nestjs/passport";
// import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
// import { User } from "src/users/user.schema";

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
//   constructor(private readonly configService: ConfigService) {
//     super({
//       clientID: configService.get("CONFIGS.GOOGLE.CLIENT_ID"),
//       clientSecret: configService.get("CONFIGS.GOOGLE.CLIENT_SECRET"),
//       callbackURL: configService.get("CONFIGS.GOOGLE.CALLBACK_URL"),
//       scope: ["profile", "email"],
//     });
//   }

//   async validate(_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
//     const { id, name, emails, photos } = profile;

//     const user = {
//       provider: "google",
//       provider_id: id,
//       email: emails[0].value,
//       email_verified: emails[0].verified,
//       name: `${name.givenName} ${name.familyName}`,
//       images: photos.map((photo) => photo.value),
//     } as User;

//     done(null, user);
//   }
// }
