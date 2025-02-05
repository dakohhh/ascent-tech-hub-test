import { ApiProperty } from "@nestjs/swagger";
import { ProfileAgeGroup } from "../profile.schema";
import { IsNotEmpty, IsString, IsEnum, IsOptional, IsBoolean } from "class-validator";
import { Transform } from "class-transformer";

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "New Profile" })
  profileName: string;

  @ApiProperty({ enum: ProfileAgeGroup, example: ProfileAgeGroup.ADULT })
  @IsNotEmpty()
  @IsEnum(ProfileAgeGroup)
  ageGroup: ProfileAgeGroup;

  @ApiProperty({ type: Boolean, example: false })
  @IsBoolean()
  @Transform(({ value }) => value === "true" || value === true)
  parentalControl: boolean;

  @ApiProperty({ required: false, type: "string", format: "binary" })
  @IsOptional()
  file?: Express.Multer.File;

  constructor(profileName: string = "Profile 1", ageGroup: ProfileAgeGroup = ProfileAgeGroup.ADULT, parentalControl: boolean = false) {
    this.profileName = profileName;
    this.ageGroup = ageGroup;
    this.parentalControl = parentalControl;
  }
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: "New Profile" })
  profileName?: string;

  @ApiProperty({ enum: ProfileAgeGroup, example: ProfileAgeGroup.ADULT })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ProfileAgeGroup)
  ageGroup?: ProfileAgeGroup;

  @ApiProperty({ type: Boolean, example: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true" || value === true)
  parentalControl?: boolean;
}

export class UpdateProfileImageDto {
  @ApiProperty({ required: false, type: "string", format: "binary" })
  @IsOptional()
  file?: Express.Multer.File;
}
