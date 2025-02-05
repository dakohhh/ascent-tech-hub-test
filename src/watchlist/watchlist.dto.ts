import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";

export class AddToWatchListDto {
  @ApiProperty({ type: String, required: true, example: "60f1b0b3b3b3b3b3b3b3b3b3" })
  @IsMongoId()
  movie: string;

  @ApiProperty({ type: String, required: true, example: "60f1b0b3b3b3b3b3b3b3b3b3" })
  @IsMongoId()
  profile: string;
}
