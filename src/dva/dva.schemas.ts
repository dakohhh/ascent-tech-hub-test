import * as mongoose from "mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type DVADocument = mongoose.HydratedDocument<DVA>;

@Schema({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })
export class DVA {
  @ApiProperty({ type: String, example: "60f1b0b3b3b3b3b3b3b3b3b3" })
  _id: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  @Prop({ default: null })
  account_name: string | null;

  @ApiProperty()
  @Prop({ type: String })
  account_number: string;

  @ApiProperty()
  @Prop()
  bank_name: string;

  @ApiProperty()
  @Prop({ type: String })
  customer_code: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true })
  user: mongoose.Schema.Types.ObjectId;
}

export const DVASchema = SchemaFactory.createForClass(DVA);
