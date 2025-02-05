import { AxiosHeaders } from "axios";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { BadRequestException, Injectable } from "@nestjs/common";
import { PaystackPayWithTransferDto, PaystackCreateCustomerDto, PaystackCreateDVADto, PaystackCreateSubscriptionDto, PaystackCreateSubscriptionPlanDto } from "./paystack.dto";
import { PaystackTransactionInitializeResponse } from "./interfaces/transaction-initialize.interface";

@Injectable()
export class PaystackService {
  private readonly paystackSecretKey: string;
  private readonly paystackBaseUrl: string;
  private readonly paystackHeaders: AxiosHeaders;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.paystackSecretKey = this.configService.get<string>("CONFIGS.PAYSTACK.PAYSTACK_SECRET_KEY");
    this.paystackBaseUrl = this.configService.get<string>("CONFIGS.PAYSTACK.PAYSTACK_BASE_URL");

    this.paystackHeaders = new AxiosHeaders();
    this.paystackHeaders.set("Authorization", `Bearer ${this.paystackSecretKey}`);
    this.paystackHeaders.set("Content-Type", "application/json");
  }

  // Paystack Service Functions

  async createCustomer(paystackCreateCustomerDto: PaystackCreateCustomerDto) {
    try {
      const response = await this.httpService.axiosRef.post(`${this.paystackBaseUrl}/customer`, paystackCreateCustomerDto, { headers: this.paystackHeaders });
      return response.data.data;
    } catch (err) {
      throw new BadRequestException(err.response.data?.message || "An error occurred");
    }
  }
  async payWithTransfer(paystackTransferDto: PaystackPayWithTransferDto) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await this.httpService.axiosRef.post(`${this.paystackBaseUrl}/charge`, paystackTransferDto, { headers: this.paystackHeaders });
    } catch (err) {
      throw new BadRequestException(err.response.data?.message || "An error occurred");
    }
  }
  async createdDedicatedVirtualAccount(paystackCreateCustomerDto: PaystackCreateCustomerDto) {
    try {
      const { customer_code } = await this.createPaystackCustomer(paystackCreateCustomerDto);

      const createDVADto = new PaystackCreateDVADto({ customer: customer_code, preferred_bank: this.configService.get<string>("DEPLOYMENT_ENV") ? "test-bank" : "wema-bank", first_name: paystackCreateCustomerDto.firstname, last_name: paystackCreateCustomerDto.lastname });

      const response = await this.httpService.axiosRef.post(`${this.paystackBaseUrl}/dedicated_account`, createDVADto, { headers: this.paystackHeaders });

      return response.data.data;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.response.data?.message || "An error occurred");
    }
  }

  async createPaystackCustomer(paystackCreateCustomerDto: PaystackCreateCustomerDto) {
    try {
      const response = await this.httpService.axiosRef.post(`${this.paystackBaseUrl}/customer`, paystackCreateCustomerDto, { headers: this.paystackHeaders });
      return response.data.data;
    } catch (err) {
      throw new BadRequestException(err.response.data?.message || "An error occurred");
    }
  }

  async createSubscriptionPlan(paystackCreateSubscriptionPlanDto: PaystackCreateSubscriptionPlanDto) {
    try {
      const response = await this.httpService.axiosRef.post(`${this.paystackBaseUrl}/plan`, paystackCreateSubscriptionPlanDto, { headers: this.paystackHeaders });
      return response.data.data;
    } catch (err) {
      throw new BadRequestException(err.response.data?.message || "An error occurred");
    }
  }

  async getAllSubscriptionPlans() {
    try {
      const response = await this.httpService.axiosRef.get(`${this.paystackBaseUrl}/plan`, { headers: this.paystackHeaders });
      return response.data.data;
    } catch (err) {
      throw new BadRequestException(err.response.data?.message || "An error occurred");
    }
  }

  async createSubscription(paystackCreateSubscriptionDto: PaystackCreateSubscriptionDto): Promise<PaystackTransactionInitializeResponse> {
    try {
      const response = await this.httpService.axiosRef.post<{ data: PaystackTransactionInitializeResponse }>(`${this.paystackBaseUrl}/transaction/initialize`, paystackCreateSubscriptionDto, { headers: this.paystackHeaders });
      return response.data.data;
    } catch (err) {
      throw new BadRequestException(err.response?.data?.message || "An error occurred");
    }
  }

  async getSubscription(subscriptionCode: string) {
    try {
      const response = await this.httpService.axiosRef.get(`${this.paystackBaseUrl}/subscription/${subscriptionCode}`, { headers: this.paystackHeaders });
      return response.data.data;
    } catch (err) {
      throw new BadRequestException(err.response?.data?.message || "An error occurred");
    }
  }
}
