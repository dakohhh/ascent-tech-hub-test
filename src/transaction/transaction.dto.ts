import { Prop } from "@nestjs/mongoose";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TransactionMerchant, TransactionMethodType, TransactionType, TransactionStatus } from "./transaction.schema";
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsString, IsOptional } from "class-validator";

export class CreateTransactionDto {
  @ApiProperty({ type: String, required: true, example: "60f1b0b3b3b3b3b3b3b3b3b3" })
  @IsMongoId()
  @IsNotEmpty()
  user: string;

  @ApiProperty({ type: Number, example: 1000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: TransactionType, default: TransactionType.DEPOSIT })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ type: String, required: false })
  @Prop({ type: String, default: null })
  description: string;

  @ApiProperty({ enum: TransactionMerchant })
  @IsEnum(TransactionMerchant)
  merchant: TransactionMerchant;

  @ApiProperty({ enum: TransactionStatus, default: TransactionStatus.PENDING })
  @IsEnum(TransactionStatus)
  status: TransactionStatus;

  @ApiProperty({ enum: TransactionMethodType })
  @IsEnum(TransactionMethodType)
  methodType: TransactionMethodType;

  @ApiProperty({ type: String, required: true })
  @IsString()
  paystackReference: string;

  constructor(options: Partial<CreateTransactionDto>) {
    Object.assign(this, options);
  }
}

export class TransactionFilterDto {
  @ApiPropertyOptional({ enum: TransactionType })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiPropertyOptional({ enum: TransactionStatus })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @ApiPropertyOptional({ enum: TransactionMerchant })
  @IsOptional()
  @IsEnum(TransactionMerchant)
  merchant?: TransactionMerchant;

  @IsOptional()
  @ApiPropertyOptional({ enum: TransactionMethodType })
  @IsEnum(TransactionMethodType)
  methodType?: TransactionMethodType;

  constructor(options: Partial<TransactionFilterDto>) {
    Object.assign(this, options);
  }
}
