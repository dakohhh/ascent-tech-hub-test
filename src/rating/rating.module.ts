import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RatingSchema, Rating } from "../rating/schema/rating";
import { RatingController } from "./rating.controller";
import { RatingService } from "./rating.service";
import { Movie, MovieSchema } from "src/video-content-management/schemas/movie";

@Module({
  providers: [RatingService],
  controllers: [RatingController],
  imports: [
    MongooseModule.forFeature([
      { name: Rating.name, schema: RatingSchema },
      { name: Movie.name, schema: MovieSchema },
    ]),
  ],
})
export class RatingModule {}
