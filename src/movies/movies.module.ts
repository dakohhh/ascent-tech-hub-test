import { Module } from "@nestjs/common";
import { MoviesService } from "./movies.service";
import { MoviesController } from "./movies.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Movie, MovieSchema } from "src/video-content-management/schemas/movie";
import { Likes, LikesSchema } from "./schemas/likes.schema";
import { Comments, CommentsSchema } from "./schemas/comments.schema";
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: Movie.name, useFactory: () => MovieSchema },
      { name: Likes.name, useFactory: () => LikesSchema },
      { name: Comments.name, useFactory: () => CommentsSchema },
    ]),
  ],
  providers: [MoviesService],
  controllers: [MoviesController],
  exports: [MoviesService],
})
export class MoviesModule {}
