import moment from "moment";
import * as bcryptjs from "bcryptjs";
import { Model, Types } from "mongoose";
import { User } from "src/users/user.schema";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { DvaService } from "src/dva/dva.service";
import { PaystackService } from "src/paystack/paystack.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateTransactionDto } from "src/transaction/transaction.dto";
import { PaystackPayWithTransferDto } from "src/paystack/paystack.dto";
import { TransactionService } from "src/transaction/transaction.service";
import { ConfirmWalletIdDto, SendFundsToUserDto, SetArewaFlixPinDto } from "./wallet.dto";
import { TransactionMerchant, TransactionMethodType, TransactionType, TransactionStatus } from "src/transaction/transaction.schema";

@Injectable()
export class WalletService {
  constructor(
    private readonly configService: ConfigService,
    private readonly paystackService: PaystackService,
    private readonly dvaService: DvaService,
    private readonly transactionService: TransactionService,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async fundWallet(user: User, amount: number) {
    const currentBalance = parseFloat(user.balance.toString());

    const newBalance = Types.Decimal128.fromString((currentBalance + amount).toFixed(2));

    await this.userModel.updateOne({ _id: user._id }, { balance: newBalance });
  }

  async debitWallet(user: User, amount: number) {
    const currentBalance = parseFloat(user.balance.toString());

    const newBalance = Types.Decimal128.fromString((currentBalance - amount).toFixed(2));

    await this.userModel.updateOne({ _id: user._id }, { balance: newBalance });

    // TODO: Send notification to the user
    // FIXME: Send email to the user
  }

  async payWithTransferViaPaystack(user: User, amount: number) {
    const paystackTransferDto: PaystackPayWithTransferDto = {
      amount: `${amount * 100}`,
      email: user.email,
      bank_transfer: {
        account_expires_at: moment().utc().add(1, "hour").toISOString(), // Expires in 1 hour
      },
    };

    await this.paystackService.payWithTransfer(paystackTransferDto);
  }

  async getDVA(user: User) {
    const dva = await this.dvaService.findById(String(user.dva));
    return { dva };
  }

  async setArewaFlixPin(user: User, setArewaFlixPinDto: SetArewaFlixPinDto) {
    // Check if the pin is already set
    if (user.arewaflixPin) {
      throw new BadRequestException("ArewaFlix pin already set");
    }

    const hashedPin = await bcryptjs.hash(setArewaFlixPinDto.pin, this.configService.get("CONFIGS.BCRYPT_SALT"));

    await this.userModel.updateOne({ _id: user._id }, { arewaflixPin: hashedPin });
  }

  async sendFundsToUser(user: User, sendFundsToUserDto: SendFundsToUserDto) {
    // Check if the user has sufficient funds
    const currentBalance = parseFloat(user.balance.toString());

    if (currentBalance < sendFundsToUserDto.amount) {
      throw new BadRequestException("Insufficient funds");
    }

    // Check if the user is sending to self
    if (user.walletId === sendFundsToUserDto.recipientWalletId) {
      throw new BadRequestException("Cannot send funds to self");
    }

    // Check if the user has set the pin
    if (!user.arewaflixPin) {
      throw new BadRequestException("ArewaFlix pin not set");
    }

    // Check if the pin is correct
    const isPinCorrect = await bcryptjs.compare(sendFundsToUserDto.pin, user.arewaflixPin);

    if (!isPinCorrect) {
      throw new BadRequestException("incorrect ArewaFlix pin");
    }

    // Check if the recipient exists
    const recipient = await this.userModel.findOne({ walletId: sendFundsToUserDto.recipientWalletId }).select(["_id", "balance"]).lean();

    if (!recipient) {
      throw new BadRequestException("Recipient not found");
    }

    // Debit the user
    await this.debitWallet(user, sendFundsToUserDto.amount);

    // Credit the recipient
    await this.fundWallet(recipient, sendFundsToUserDto.amount);

    // Create the transaction record
    const userTransactionDto = new CreateTransactionDto({ user: String(user._id), amount: sendFundsToUserDto.amount, type: TransactionType.TRANSFER, status: TransactionStatus.SUCCESS, methodType: TransactionMethodType.DEBIT, merchant: TransactionMerchant.AREWAFLIX });
    const recipientTransactionDto = new CreateTransactionDto({ user: String(recipient._id), amount: sendFundsToUserDto.amount, type: TransactionType.TRANSFER, status: TransactionStatus.SUCCESS, methodType: TransactionMethodType.CREDIT, merchant: TransactionMerchant.AREWAFLIX });

    await this.transactionService.createTransaction(userTransactionDto);

    await this.transactionService.createTransaction(recipientTransactionDto);

    // Send email to the recipient

    // Send notification to the recipient

    // Send notification to the user

    // Send email to the user
  }

  async confirmWalletId(user: User, confirmWalletIdDto: ConfirmWalletIdDto) {
    const _user = await this.userModel.findOne({ walletId: confirmWalletIdDto.walletId }).select(["firstName", "lastName"]).lean();

    if (!_user) {
      throw new BadRequestException("invalid wallet id");
    }

    return { user: _user };
  }
}
