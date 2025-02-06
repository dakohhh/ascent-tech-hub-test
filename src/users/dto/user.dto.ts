import { Gender, User } from "../user.schema";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationResponseDto } from "src/common/dto/pagination.dto";
import { IsNotEmpty, IsOptional, IsString, IsEnum, IsPhoneNumber, IsEmail } from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiPropertyOptional({ required: false, enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}

export class DummyMessageDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
