import * as mongoose from "mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "src/users/user.schema";

export enum ProfileAgeGroup {
  CHILD = "child",
  TEEN = "teen",
  ADULT = "adult",
}

@Schema({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })
export class Profile {
  @ApiProperty({ type: String, example: "Profile 1", required: true })
  @Prop({ type: String, required: true })
  profileName: string;

  @ApiProperty({ type: String, example: "Profile 1" })
  @Prop({ type: String, default: null })
  profileImage: string;

  @ApiProperty({ type: Boolean, example: true, default: false })
  @Prop({ type: Boolean, required: true })
  isDefault: boolean;

  @ApiProperty({ type: String, example: "60f1b0b3b3b3b3b3b3b3b3b3" })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  user: User;

  @ApiProperty({ type: Boolean, required: true })
  @Prop({ type: Boolean })
  parentalControl: boolean;

  @ApiProperty({ enum: ProfileAgeGroup, default: ProfileAgeGroup.ADULT })
  @Prop({ enum: ProfileAgeGroup, default: ProfileAgeGroup.ADULT })
  ageGroup: ProfileAgeGroup;
}

export type ProfileDocument = mongoose.HydratedDocument<Profile>;

export const ProfileSchema = SchemaFactory.createForClass(Profile);
