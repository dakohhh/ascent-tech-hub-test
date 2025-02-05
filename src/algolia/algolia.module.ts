import { Module } from "@nestjs/common";
import { AlgoliaService } from "./algolia.service";
import { AlgoliaController } from "./algolia.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Movie, MovieSchema } from "src/video-content-management/schemas/movie";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]), ConfigModule],
  providers: [AlgoliaService],
  controllers: [AlgoliaController],
  exports: [AlgoliaService],
})
export class AlgoliaModule {}
