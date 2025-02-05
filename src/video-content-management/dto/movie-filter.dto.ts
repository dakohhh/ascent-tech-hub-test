import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsEnum } from "class-validator";
import { Genre, Language } from "../schemas/movie";

export class MovieSearchFilterDto {
  @ApiPropertyOptional({ enum: Language })
  @IsOptional()
  @IsEnum(Language)
  language?: Language;

  @ApiPropertyOptional({ enum: Genre, default: Genre.ACTION, isArray: true })
  @IsOptional()
  @IsEnum(Genre)
  genres?: Genre[];
}
