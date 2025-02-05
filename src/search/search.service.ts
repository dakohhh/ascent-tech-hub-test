import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Movie } from "src/video-content-management/schemas/movie";
import { AlgoliaService } from "src/algolia/algolia.service";
import { SearchMovieDto } from "./search.dto";
@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
    private readonly algoliaService: AlgoliaService
  ) {}

  async searchMovie(searchMovieDto: SearchMovieDto) {
    const response = await this.algoliaService.searchIndex(searchMovieDto.q, Movie);

    const filteredHits = response[0]["hits"].map((hit) => ({
      _id: hit.objectID,
      title: hit.title,
      genres: hit.genres,
      releaseDate: hit.releaseDate,
      description: hit.description,
      language: hit.language,
      thumb_nail: hit.thumb_nail,
    }));

    return filteredHits;
  }
}
