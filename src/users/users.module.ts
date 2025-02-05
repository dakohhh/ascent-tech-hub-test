import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { UsersService } from "./users.service";
import { AwsModule } from "src/aws/aws.module";
import { UsersController } from "./users.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserDocument, UserSchema } from "./user.schema";

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          return UserSchema.pre<UserDocument>(/^save|^find|^findOne/, function (next) {
            // this.populate({ path: "interests", select: "name description type image" });
            // this.populate({ path: "cravings", select: "name" });
            // this.populate({ path: "craving-history", select: "cravings" });
            next();
          });
        },
      },
    ]),
    AwsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
