import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Movie, MovieSchema } from "./schemas/movie";
import { VideoContentManagementController } from "./video-content-management.controller";
import { VideoContentManagementService } from "./video-content-management.service";
import { AwsModule } from "../aws/aws.module";
import { AlgoliaModule } from "src/algolia/algolia.module";
@Module({
  controllers: [VideoContentManagementController],
  providers: [VideoContentManagementService],
  imports: [MongooseModule.forFeatureAsync([{ name: Movie.name, useFactory: () => MovieSchema }]), AwsModule, AlgoliaModule],
})
export class VideoContentManagementModule {}
