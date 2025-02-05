import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsISO8601, IsNotEmpty, IsNumber, IsNumberString, IsPhoneNumber, IsString, ValidateNested, IsEnum } from "class-validator";
import { ArewaSubscriptionPlanType, SubscriptionPlanIntervalType } from "src/common/types/subscription.types";

class BankTransferDto {
  @IsISO8601()
  @IsNotEmpty()
  account_expires_at: string;
}

export class PaystackPayWithTransferDto {
  @ApiProperty({ example: "wisdomdakoh@gmail.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "2500" })
  @IsNumberString()
  amount: string;

  @ValidateNested()
  @Type(() => BankTransferDto)
  bank_transfer: BankTransferDto;
}

export class PaystackCreateCustomerDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsString()
  @IsPhoneNumber("NG")
  phone: string;

  constructor(options: { email: string; firstname: string; lastname: string; phone: string }) {
    this.email = options.email;
    this.firstname = options.firstname;
    this.lastname = options.lastname;
    this.phone = options.phone;
  }
}

export class PaystackCreateDVADto {
  @ApiProperty({ example: "CUS_358xertt55" })
  @IsString()
  @IsNotEmpty()
  customer: string;

  @ApiProperty({ example: "titan-paystack" })
  @IsString()
  @IsNotEmpty()
  preferred_bank: string;

  @ApiProperty({ example: "John" })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: "Doe" })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  constructor(options: { customer: string; preferred_bank: string; first_name: string; last_name: string }) {
    this.customer = options.customer;
    this.preferred_bank = options.preferred_bank;
    this.first_name = options.first_name;
    this.last_name = options.last_name;
  }
}

export class PaystackCreateSubscriptionPlanDto {
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

export class PaystackCreateSubscriptionDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  plan: string;
}
