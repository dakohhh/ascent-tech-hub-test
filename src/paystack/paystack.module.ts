import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { PaystackService } from "./paystack.service";

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
      }),
    }),
    ConfigModule,
  ],
  providers: [PaystackService],
  exports: [PaystackService],
})
export class PaystackModule {}
