import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsMongoId } from "class-validator";

export class CreateSubscriptionDto {
  @ApiProperty({ type: String, required: true, example: "60f1b0b3b3b3b3b3b3b3b3b3" })
  @IsMongoId()
  @IsNotEmpty()
  plan: string;
}
