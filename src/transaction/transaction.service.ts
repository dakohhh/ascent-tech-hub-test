import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateTransactionDto, TransactionFilterDto } from "./transaction.dto";
import { Transaction, TransactionDocument } from "./transaction.schema";
import { User } from "src/users/user.schema";
import { IPaginationResult, Paginator } from "src/common/utils/pagination";
import { v4 as uuidv4 } from "uuid";
import { PaginationDto } from "src/common/dto/pagination.dto";

@Injectable()
export class TransactionService {
  constructor(@InjectModel(Transaction.name) private readonly transactionModel: Model<TransactionDocument>) {}
  async createTransaction(createTransactionDto: CreateTransactionDto): Promise<TransactionDocument> {
    const amount = Types.Decimal128.fromString(createTransactionDto.amount.toFixed(2));
    // Generate a reference, and save the transaction
    const reference = uuidv4();

    const context = {
      ...createTransactionDto,
      amount,
      reference,
    };

    return this.transactionModel.create(context);
  }

  async getTransaction(transactionId: string): Promise<TransactionDocument> {
    const transaction = await this.transactionModel.findById(transactionId).lean().exec();

    if (!transaction) {
      throw new NotFoundException("Transaction not found");
    }
    return transaction;
  }

  async getTransactionByUser(user: User, transactionId: string): Promise<TransactionDocument> {
    const transactions = await this.transactionModel.findOne({ user: user._id, _id: transactionId }).lean().exec();

    if (!transactions) {
      throw new NotFoundException("Transaction not found");
    }
    return transactions;
  }

  async getAllTransactionsByUser(user: User, transactionFilterDto: TransactionFilterDto): Promise<IPaginationResult<Transaction>> {
    const paginator = new Paginator(this.transactionModel, 1, 10, { filter: { user: user._id, ...transactionFilterDto } });

    const result = await paginator.paginate();

    return result;
  }

  async getAllTransactions(transactionFilterDto: TransactionFilterDto, paginationDto: PaginationDto): Promise<IPaginationResult<Transaction>> {
    const paginator = new Paginator(this.transactionModel, paginationDto.page, paginationDto.limit, { filter: { ...transactionFilterDto } });

    const result = await paginator.paginate();

    return result;
  }
}
