import * as mongoose from "mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum TransactionStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}

export enum TransactionType {
  DEPOSIT = "deposit",
  PAYMENT = "payment",
  TRANSFER = "transfer",
}

export enum TransactionMerchant {
  PAYSTACK = "paystack",
  FLUTTERWAVE = "flutterwave",
  AREWAFLIX = "arewaflix",
}

export enum TransactionMethodType {
  CREDIT = "credit",
  DEBIT = "debit",
}

@Schema({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })
export class Transaction {
  @ApiProperty({ type: String, required: true, example: "60f1b0b3b3b3b3b3b3b3b3b3" })
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" })
  user: mongoose.Types.ObjectId;

  @ApiProperty({ type: Number, example: "0.00" })
  @Prop({ type: mongoose.Schema.Types.Decimal128, required: true })
  amount: mongoose.Types.Decimal128;

  @ApiProperty({ enum: TransactionType, default: TransactionType.DEPOSIT })
  @Prop({ enum: TransactionType, default: TransactionType.DEPOSIT })
  type: TransactionType;

  @ApiProperty({ type: String, required: false })
  @Prop({ type: String, default: null })
  description: string;

  @ApiProperty({ enum: TransactionMerchant, required: false })
  @Prop({ type: String })
  merchant: TransactionMerchant;

  @ApiProperty({ enum: TransactionStatus, default: TransactionStatus.PENDING })
  @Prop({ enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @ApiProperty({ enum: TransactionMethodType, default: "deposit" })
  @Prop({ enum: TransactionMethodType })
  methodType: string;

  @ApiProperty({ type: String, required: true })
  @Prop({ type: String, required: true })
  reference: string;

  @ApiProperty({ type: String, required: false })
  @Prop({ type: String, default: null })
  paystackReference: string;
}

export type TransactionDocument = mongoose.HydratedDocument<Transaction>;

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
