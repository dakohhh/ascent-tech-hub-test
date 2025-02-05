import * as mongoose from "mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ArewaSubscriptionPlanType, SubscriptionPlanIntervalType } from "src/common/types/subscription.types";

@Schema({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })
export class SubscriptionPlan {
  @ApiProperty({ type: String, required: true, example: ArewaSubscriptionPlanType.AREWA_MONTHLY })
  @Prop({ type: String, required: true, enum: ArewaSubscriptionPlanType })
  name: ArewaSubscriptionPlanType;

  @ApiProperty({ type: String, required: true, example: SubscriptionPlanIntervalType.MONTHLY })
  @Prop({ type: String, required: true, enum: SubscriptionPlanIntervalType })
  interval: SubscriptionPlanIntervalType;

  @ApiProperty({ type: Number, required: true, example: 10000 })
  @Prop({ type: Number, required: true })
  amount: number;

  @ApiProperty({ type: String, required: true, example: "PLN_xxxxxxxxxxx" })
  @Prop({ type: String, required: true })
  plan_code: string;
}

export type SubscriptionPlanDocument = mongoose.HydratedDocument<SubscriptionPlan>;

export const SubscriptionPlanSchema = SchemaFactory.createForClass(SubscriptionPlan);
