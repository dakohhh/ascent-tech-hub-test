import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DVA, DVADocument } from "./dva.schemas";
import { PaystackCreateCustomerDto } from "src/paystack/paystack.dto";
import { PaystackService } from "src/paystack/paystack.service";
import { User } from "src/users/user.schema";

@Injectable()
export class DvaService {
  constructor(
    @InjectModel(DVA.name) private readonly dvaModel: Model<DVADocument>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly paystackService: PaystackService
  ) {}

  async create(user: User, paystackCreateCustomerDto: PaystackCreateCustomerDto) {
    const dvaResponse = await this.paystackService.createdDedicatedVirtualAccount(paystackCreateCustomerDto);

    const dva = await this.dvaModel.create({
      user: user._id,
      account_number: dvaResponse.account_number,
      bank_name: dvaResponse.bank.name,
      customer_code: dvaResponse.customer.customer_code,
      account_name: dvaResponse.account_name,
    });
    // Assign the DVA to the user
    await this.userModel.updateOne({ _id: user._id }, { dva: dva._id });
  }

  async findById(id: string): Promise<DVADocument> {
    return this.dvaModel.findById(id).lean().exec();
  }

  async findByCustomerCode(customer_code: string): Promise<DVADocument> {
    return this.dvaModel.findOne({ customer_code: customer_code }).lean().exec();
  }
}
