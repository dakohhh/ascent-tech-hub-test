import { Module } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { Profile, ProfileSchema } from "./profile.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { AwsModule } from "src/aws/aws.module";

@Module({
  imports: [MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]), AwsModule],
  providers: [ProfileService],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
