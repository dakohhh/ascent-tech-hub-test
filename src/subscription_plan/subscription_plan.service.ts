import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { PaystackService } from "src/paystack/paystack.service";
import { SubscriptionPlan } from "./schemas/subscription_plan.schema";
import { BadRequestException, Injectable, OnModuleInit } from "@nestjs/common";
import { ArewaSubscriptionPlanType, SubscriptionPlanIntervalType } from "src/common/types/subscription.types";

@Injectable()
export class SubscriptionPlanService implements OnModuleInit {
  constructor(
    @InjectModel(SubscriptionPlan.name) private readonly subscriptionPlanModel: Model<SubscriptionPlan>,
    private readonly paystackService: PaystackService
  ) {}

  async onModuleInit() {
    await this.createArewaSubscriptionPlans();
  }

  async createArewaSubscriptionPlans() {
    try {
      // Get existing plans from Paystack
      const existingPlans = await this.paystackService.getAllSubscriptionPlans();

      // Check for existing plans
      const existingMonthlyPlan = existingPlans.find((plan) => plan.name === ArewaSubscriptionPlanType.AREWA_MONTHLY);
      const existingYearlyPlan = existingPlans.find((plan) => plan.name === ArewaSubscriptionPlanType.AREWA_YEARLY);

      // Create or get monthly plan from Paystack
      const arewaMonthlyPlan =
        existingMonthlyPlan ||
        (await this.paystackService.createSubscriptionPlan({
          name: ArewaSubscriptionPlanType.AREWA_MONTHLY,
          interval: SubscriptionPlanIntervalType.MONTHLY,
          amount: 500000,
        }));

      // Create or get yearly plan from Paystack
      const arewaYearlyPlan =
        existingYearlyPlan ||
        (await this.paystackService.createSubscriptionPlan({
          name: ArewaSubscriptionPlanType.AREWA_YEARLY,
          interval: SubscriptionPlanIntervalType.ANNUALLY,
          amount: 600000,
        }));

      // Upsert plans in database with plan_code from Paystack
      const [monthlyPlanDoc, yearlyPlanDoc] = await Promise.all([
        this.subscriptionPlanModel.findOneAndUpdate(
          { name: ArewaSubscriptionPlanType.AREWA_MONTHLY },
          {
            name: ArewaSubscriptionPlanType.AREWA_MONTHLY,
            interval: SubscriptionPlanIntervalType.MONTHLY,
            amount: 500000,
            plan_code: arewaMonthlyPlan.plan_code,
          },
          { upsert: true, new: true }
        ),
        this.subscriptionPlanModel.findOneAndUpdate(
          { name: ArewaSubscriptionPlanType.AREWA_YEARLY },
          {
            name: ArewaSubscriptionPlanType.AREWA_YEARLY,
            interval: SubscriptionPlanIntervalType.ANNUALLY,
            amount: 600000,
            plan_code: arewaYearlyPlan.plan_code,
          },
          { upsert: true, new: true }
        ),
      ]);

      return {
        monthlyPlan: {
          paystack: arewaMonthlyPlan,
          database: monthlyPlanDoc,
        },
        yearlyPlan: {
          paystack: arewaYearlyPlan,
          database: yearlyPlanDoc,
        },
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.response?.data?.message || "Failed to create subscription plans");
    }
  }

  async getSubscriptionPlan(planId: string) {
    return this.subscriptionPlanModel.findOne({ _id: planId });
  }

  async getAllSubscriptionPlans() {
    return this.subscriptionPlanModel.find();
  }
}
