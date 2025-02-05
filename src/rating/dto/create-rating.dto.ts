import { IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRatingDto {
  @IsString()
  @ApiProperty({ required: true, example: "this movie make sense ehnn" })
  comment: string;

  @IsNumber()
  @ApiProperty({ required: true, maxItems: 1, minLength: 1, example: 0 })
  rating: number;
}
