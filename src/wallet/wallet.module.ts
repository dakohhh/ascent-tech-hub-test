import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WalletController } from "./wallet.controller";
import { WalletService } from "./wallet.service";
import { User, UserSchema } from "src/users/user.schema";
import { PaystackModule } from "src/paystack/paystack.module";
import { DvaModule } from "src/dva/dva.module";
import { TransactionModule } from "src/transaction/transaction.module";

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), PaystackModule, DvaModule, TransactionModule],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
