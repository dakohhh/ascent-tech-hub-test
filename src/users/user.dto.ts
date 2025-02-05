import { LocationType } from "@aws-sdk/client-s3";
import { Transform, Type } from "class-transformer";
import { Gender, User, UserRole } from "./user.schema";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationResponseDto } from "src/common/dto/pagination.dto";
import { TransactionFilterDto } from "src/transaction/transaction.dto";
import { IsNotEmpty, IsOptional, IsString, IsDateString, IsEnum, IsPhoneNumber, IsBoolean } from "class-validator";

class Location {
  @ApiProperty({ default: "Point" })
  @IsEnum(LocationType)
  type: LocationType;

  @ApiProperty({ type: [Number, Number] })
  @IsNotEmpty()
  @IsEnum([Number, Number])
  coordinates: [number, number];
}

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false, example: "+2347012345678" })
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dob?: Date;

  @ApiProperty({ required: false })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Location)
  location?: Location;
}

export class UserAddImageDto {
  @ApiProperty({ required: false, type: "string", format: "binary" })
  file: Express.Multer.File;
}

export class UserUpdateImageDto {
  @ApiProperty({ required: true })
  @IsString()
  image_url: string;

  @ApiProperty({ required: true, type: "string", format: "binary" })
  file: Express.Multer.File;
}

export class GetAllUsersResponseDto {
  @ApiProperty({ isArray: true, type: User })
  users: User[];

  @ApiProperty()
  pagination: PaginationResponseDto;
}

export class DummyMessageDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class UserFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => Boolean(value === "true"))
  @IsBoolean()
  email_verified?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => Boolean(value === "true"))
  @IsBoolean()
  account_disabled?: boolean;

  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  constructor(options: Partial<TransactionFilterDto>) {
    Object.assign(this, options);
  }
}
