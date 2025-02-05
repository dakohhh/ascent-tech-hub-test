import { Module } from "@nestjs/common";
import { SubscriptionPlanService } from "./subscription_plan.service";
import { MongooseModule } from "@nestjs/mongoose";
import { PaystackModule } from "src/paystack/paystack.module";
import { SubscriptionPlan, SubscriptionPlanSchema } from "./schemas/subscription_plan.schema";
import { SubscriptionPlanController } from "./subscription_plan.controller";

@Module({
  imports: [MongooseModule.forFeature([{ name: SubscriptionPlan.name, schema: SubscriptionPlanSchema }]), PaystackModule],
  providers: [SubscriptionPlanService],
  exports: [SubscriptionPlanService],
  controllers: [SubscriptionPlanController],
})
export class SubscriptionPlanModule {}
