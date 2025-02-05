import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SearchMovieDto {
  @ApiProperty({ description: "This query searches movies on based on thier title or  description" })
  @IsString()
  @IsNotEmpty()
  q: string;
}
