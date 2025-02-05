import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/users/user.schema";
import { Transaction, TransactionSchema } from "src/transaction/transaction.schema";
import { UsersService } from "src/users/users.service";
import { AwsService } from "src/aws/aws.service";
import { TransactionService } from "src/transaction/transaction.service";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: User.name, useFactory: () => UserSchema },
      { name: Transaction.name, useFactory: () => TransactionSchema },
    ]),
  ],
  providers: [AdminService, UsersService, AwsService, TransactionService],
  controllers: [AdminController],
})
export class AdminModule {}
