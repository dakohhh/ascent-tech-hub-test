import { Controller, Get, HttpStatus, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SearchMovieDto } from "./search.dto";
import { HttpResponse } from "src/common/dto/http-response.dto";
import { SearchService } from "./search.service";

@ApiTags("Search")
@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @Get("movie")
  async searchMovie(@Query() searchMovieDto: SearchMovieDto) {
    const result = await this.searchService.searchMovie(searchMovieDto);
    return new HttpResponse("search movie", result, HttpStatus.OK);
  }
}
