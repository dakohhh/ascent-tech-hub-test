import { IsString, IsNumber, IsOptional, IsNotEmpty, IsISO8601, IsEnum } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Genre } from "../schemas/movie";
import { Language } from "../schemas/movie";
export class CreateMovieDto {
  @ApiProperty({ example: "The Avengers" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: "The Avengers is a 2012 American superhero film based on the Marvel Comics superhero team of the same name." })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 143 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  duration: number;

  @ApiProperty({
    enum: Genre,
    isArray: true,
  })
  @Transform(({ value }: { value: string }) => value.split(","))
  @IsEnum(Genre, { each: true })
  genres: Genre[];

  @ApiProperty({ example: "2023-10-12" })
  @IsNotEmpty()
  @IsISO8601()
  releaseDate: Date;

  @ApiProperty({ required: false, type: "string", format: "binary" })
  @IsOptional()
  file: Express.Multer.File;

  @ApiPropertyOptional({ required: false, type: "string", format: "binary" })
  @IsOptional()
  thumb_nail: Express.Multer.File;

  @ApiProperty({ enum: Language, example: Language.ENGLISH })
  @IsEnum(Language)
  language: Language;
}
