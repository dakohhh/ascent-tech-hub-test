import { Module } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { Transaction, TransactionSchema } from "./transaction.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { TransactionController } from './transaction.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }])],
  providers: [TransactionService],
  exports: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
