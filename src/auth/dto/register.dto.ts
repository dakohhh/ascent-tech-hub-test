import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from "class-validator";
import { Gender } from "src/users/user.schema";

export class RegisterDto {
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
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: Gender })
  @IsString()
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;
}
