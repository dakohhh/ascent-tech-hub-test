import { Model } from "mongoose";
import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "src/users/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Subscription } from "./schemas/subscription.schema";
import { CreateSubscriptionDto } from "./subscription.dto";
import { SubscriptionPlanService } from "src/subscription_plan/subscription_plan.service";
import { PaystackService } from "src/paystack/paystack.service";
@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionPlanService: SubscriptionPlanService,
    @InjectModel(Subscription.name) private readonly subscriptionModel: Model<Subscription>,
    private readonly paystackService: PaystackService
  ) {}
  async createSubscription(user: User, createSubscriptionDto: CreateSubscriptionDto) {
    const plan = await this.subscriptionPlanService.getSubscriptionPlan(createSubscriptionDto.plan);

    if (!plan) throw new BadRequestException("Plan not found");

    const plans = await this.paystackService.getAllSubscriptionPlans();

    console.log(plans);

    const subscription = await this.paystackService.createSubscription({
      email: user.email,
      amount: plan.amount,
      plan: plan.plan_code,
    });

    console.log(subscription);

    // const subscription = await this.subscriptionModel.create({
    //   user: user._id,
    //   plan: createSubscriptionDto.plan,
    //   is_active: true,
    //   start_date: moment().toDate(),
    //   end_date: moment().add(1, "month").toDate(),
    // });

    // console.log(subscription);

    // return subscription;
    // const subscription = new this.subscriptionModel(createSubscriptionDto);
    // await subscription.save();
    // return subscription;
  }
}
