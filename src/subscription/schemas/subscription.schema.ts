import * as mongoose from "mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })
export class Subscription {
  @ApiProperty({ type: mongoose.Schema.Types.ObjectId, required: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  user: mongoose.Schema.Types.ObjectId;

  @ApiProperty({ type: mongoose.Schema.Types.ObjectId, required: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  plan: mongoose.Schema.Types.ObjectId;

  @ApiProperty({ type: String, required: true })
  @Prop({ type: String, required: true })
  subscription_code: string;

  @ApiProperty({ type: Boolean, required: true })
  @Prop({ type: Boolean, required: true })
  is_active: boolean;

  @ApiProperty({ type: Date, required: true })
  @Prop({ type: Date, required: true })
  start_date: Date;

  @ApiProperty({ type: Date, required: true })
  @Prop({ type: Date, required: true })
  end_date: Date;
}

export type SubscriptionDocument = mongoose.HydratedDocument<Subscription>;

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
