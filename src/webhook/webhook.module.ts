import { Module } from "@nestjs/common";
import { WebhookController } from "./webhook.controller";
import { WebhookService } from "./webhook.service";
import { WalletModule } from "src/wallet/wallet.module";
import { DvaModule } from "src/dva/dva.module";
import { TransactionModule } from "src/transaction/transaction.module";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [WalletModule, DvaModule, UsersModule, TransactionModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
