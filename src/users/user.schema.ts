import * as mongoose from "mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  NON_BINARY = "non-binary",
}

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })
export class User {
  @ApiProperty({ type: String, example: "60f1b0b3b3b3b3b3b3b3b3b3" })
  _id: mongoose.Types.ObjectId;

  @ApiProperty()
  @Prop({ default: null })
  firstName: string | null;

  @ApiProperty()
  @Prop({ default: null })
  lastName: string | null;

  @ApiProperty()
  @Prop({ unique: true })
  email: string;

  @ApiProperty()
  @Prop({ unique: true })
  phoneNumber: string;

  @ApiProperty()
  @Prop()
  password: string;

  @ApiProperty()
  @Prop({ type: String, enum: Gender })
  gender: Gender;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
