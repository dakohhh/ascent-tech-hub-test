import { Module } from "@nestjs/common";
import { SearchService } from "./search.service";
import { SearchController } from "./search.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Movie, MovieSchema } from "src/video-content-management/schemas/movie";
import { AlgoliaModule } from "src/algolia/algolia.module";

@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Movie.name, useFactory: () => MovieSchema }]), AlgoliaModule],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
