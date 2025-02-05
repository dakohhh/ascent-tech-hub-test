import { Injectable } from "@nestjs/common";
import { Genre } from "src/video-content-management/schemas/movie";

@Injectable()
export class GenreService {
  async getGenres(): Promise<string[]> {
    return Object.values(Genre);
  }
}
