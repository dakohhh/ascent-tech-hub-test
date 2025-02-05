import * as mongoose from "mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum UserRole {
  USER = "user",
  SUPER_ADMIN = "super-admin",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  NON_BINARY = "non-binary",
}

export enum LocationType {
  POINT = "Point",
}

export enum AccountSubscriptionPlan {
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })
export class User {
  @ApiProperty({ type: String, example: "60f1b0b3b3b3b3b3b3b3b3b3" })
  _id: mongoose.Schema.Types.ObjectId;

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
  @Prop({ default: null })
  phoneNumber: string | null;

  @ApiProperty()
  @Prop({ type: [String], default: [] })
  images: string[];

  @ApiProperty()
  @Prop()
  password: string;

  @ApiProperty()
  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.Decimal128, default: mongoose.Types.Decimal128.fromString("0.00") })
  balance: mongoose.Types.Decimal128;

  @ApiProperty()
  @Prop({ type: Boolean, default: false })
  isStaff: boolean;

  @ApiProperty()
  @Prop({ type: Boolean, default: false })
  isSuperAdmin: boolean;

  @ApiProperty()
  @Prop()
  provider: string;

  @ApiProperty()
  @Prop()
  provider_id: string;

  @ApiProperty()
  @Prop({ default: false })
  email_verified: boolean;

  @ApiProperty()
  @Prop({ default: false })
  account_disabled: boolean;

  @ApiProperty()
  @Prop()
  dob: Date;

  @ApiProperty()
  @Prop({ type: String, enum: Gender })
  gender: Gender;

  @ApiProperty()
  @Prop()
  bio: string;

  @ApiProperty()
  @Prop({ type: String, enum: AccountSubscriptionPlan, default: AccountSubscriptionPlan.MONTHLY })
  accountType: AccountSubscriptionPlan;

  @ApiProperty({ type: Object, example: { type: "Point", coordinates: [0.0, 0.0] } })
  @Prop({ type: Object, default: null })
  location: {
    type: LocationType;
    coordinates: [number, number];
  } | null;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty({ type: String, example: "60f1b0b3b3b3b3b3b3b3b3b3" })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "DVA", required: false, default: null })
  dva: mongoose.Schema.Types.ObjectId | null;

  @ApiProperty()
  @Prop({ type: String, default: null })
  arewaflixPin: string | null;

  @ApiProperty()
  @Prop({ type: String, default: null })
  walletId: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
