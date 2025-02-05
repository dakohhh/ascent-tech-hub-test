/* eslint-disable @typescript-eslint/no-unused-vars */
import { v4 as uuidv4 } from "uuid";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { WalletService } from "src/wallet/wallet.service";
import { DvaService } from "src/dva/dva.service";
import { UsersService } from "src/users/users.service";
import { TransactionService } from "src/transaction/transaction.service";
import { CreateTransactionDto } from "src/transaction/transaction.dto";
import { TransactionStatus, TransactionMethodType, TransactionMerchant, TransactionType } from "src/transaction/transaction.schema";
// Deposit data {
//   id: 4370750652,
//   domain: 'test',
//   status: 'success',
//   reference: '17314753357001p3925dm3ffpjis',
//   amount: 200000,
//   message: null,
//   gateway_response: 'Approved',
//   paid_at: '2024-11-13T05:22:16.000Z',
//   created_at: '2024-11-13T05:22:16.000Z',
//   channel: 'dedicated_nuban',
//   currency: 'NGN',
//   ip_address: null,
//   metadata: {
//     receiver_account_number: '1238223514',
//     receiver_bank: 'Test Bank',
//     receiver_account_type: null,
//     custom_fields: [ [Object], [Object] ]
//   },
//   fees_breakdown: null,
//   log: null,
//   fees: 2000,
//   fees_split: null,
//   authorization: {
//     authorization_code: 'AUTH_8u1e5747h9',
//     bin: '008XXX',
//     last4: 'X553',
//     exp_month: '10',
//     exp_year: '2024',
//     channel: 'dedicated_nuban',
//     card_type: 'transfer',
//     bank: null,
//     country_code: 'NG',
//     brand: 'Managed Account',
//     reusable: false,
//     signature: null,
//     account_name: null,
//     sender_country: 'NG',
//     sender_bank: null,
//     sender_bank_account_number: 'XXXXXX4553',
//     receiver_bank_account_number: '1238223514',
//     receiver_bank: 'Test Bank'
//   },
//   customer: {
//     id: 206339423,
//     first_name: 'John',
//     last_name: 'Doe',
//     email: 'wisdomdak@gmail.com',
//     customer_code: 'CUS_e26hqju3t22ueju',
//     phone: '+2347012345678',
//     metadata: {},
//     risk_action: 'default',
//     international_format_phone: '+2347012345678'
//   },
//   plan: {},
//   subaccount: {},
//   split: {},
//   order_id: null,
//   paidAt: '2024-11-13T05:22:16.000Z',
//   requested_amount: 200000,
//   pos_transaction_data: null,
//   source: null
// }
@Injectable()
export class WebhookService {
  constructor(
    private readonly configService: ConfigService,
    private readonly walletService: WalletService,
    private readonly userService: UsersService,
    private readonly dvaService: DvaService,
    private readonly transactionService: TransactionService
  ) {}
  async paystackProcessDeposit(data: any) {
    try {
      console.log("Deposit data", data);

      if (data.plan) return this.paystackProcessSubscription(data);

      const dva = await this.dvaService.findByCustomerCode(data.customer.customer_code);
      // Get the user
      const user = await this.userService.getById(String(dva.user));
      const amount = data.amount / 100;

      // Fund the user wallet
      await this.walletService.fundWallet(user, amount);

      const createTransaction = new CreateTransactionDto({ user: String(user._id), amount, type: TransactionType.DEPOSIT, status: TransactionStatus.SUCCESS, methodType: TransactionMethodType.CREDIT, merchant: TransactionMerchant.PAYSTACK, paystackReference: data.reference });
      await this.transactionService.createTransaction(createTransaction);
    } catch (error) {
      console.log(error);
      // Use Sentry to log the error
    }
  }

  async paystackProcessSubscription(data: any) {
    console.log("Subscription data", data);
  }

  async paystackProcessWithdrawal(data: any) {}
  async paystackProcessFailedWithdrawal(data, status) {}
}
