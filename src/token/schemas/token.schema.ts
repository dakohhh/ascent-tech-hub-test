import * as mongoose from "mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { User } from "src/users/user.schema";

export enum TokenType {
  REFRESH_TOKEN = "refresh-token",
  PASSWORD_RESET = "password-reset",
  EMAIL_VERIFICATION = "email-verification",
}

export type TokenDocument = mongoose.HydratedDocument<Token>;

@Schema()
export class Token {
  @ApiProperty()
  _id: mongoose.Types.ObjectId;

  @ApiProperty()
  @Prop()
  code: string | null;

  @ApiProperty()
  @Prop()
  token: string | null;

  @ApiProperty()
  @Prop({ type: String, enum: TokenType })
  type: TokenType;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  user: User;

  @ApiProperty()
  @Prop({ type: Date })
  expires_at: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
