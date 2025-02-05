import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { ArewaSubscriptionPlanType, SubscriptionPlanIntervalType } from "src/common/types/subscription.types";

export class CreateSubscriptionPlanDto {
  @ApiProperty({ example: ArewaSubscriptionPlanType.AREWA_MONTHLY })
  @IsEnum(ArewaSubscriptionPlanType)
  @IsNotEmpty()
  name: ArewaSubscriptionPlanType;

  @IsEnum(SubscriptionPlanIntervalType)
  @IsNotEmpty()
  interval: SubscriptionPlanIntervalType;

  @ApiProperty({ example: 10000 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  constructor(options: { name: ArewaSubscriptionPlanType; interval: SubscriptionPlanIntervalType; amount: number; description: string }) {
    this.name = options.name;
    this.interval = options.interval;
    this.amount = options.amount;
  }
}
