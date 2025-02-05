import { Module } from "@nestjs/common";
import { WatchlistService } from "./watchlist.service";
import { WatchlistController } from "./watchlist.controller";
import { ProfileModule } from "src/profile/profile.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Movie, MovieSchema } from "src/video-content-management/schemas/movie";
import { WatchList, WatchListSchema } from "./watchlist.schema";
import { Profile, ProfileSchema } from "src/profile/profile.schema";
import { MoviesModule } from "src/movies/movies.module";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: Movie.name, useFactory: () => MovieSchema },
      { name: WatchList.name, useFactory: () => WatchListSchema },
      { name: Profile.name, useFactory: () => ProfileSchema },
    ]),
    ProfileModule,
    MoviesModule,
  ],
  providers: [WatchlistService],
  controllers: [WatchlistController],
})
export class WatchlistModule {}
