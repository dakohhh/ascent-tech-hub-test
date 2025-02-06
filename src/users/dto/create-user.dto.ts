import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { Gender } from "../user.schema";

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: "+2347012345678" })
  @IsString()
  @IsPhoneNumber("NG")
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: Gender })
  @IsString()
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;
}
