import { Controller, Get, HttpStatus } from "@nestjs/common";
import { GenreService } from "./genre.service";
import { HttpResponse } from "src/common/dto/http-response.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Genre")
@Controller("genre")
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  async getGenres() {
    const result = await this.genreService.getGenres();

    return new HttpResponse("Get all genres", result, HttpStatus.OK);
  }
}
