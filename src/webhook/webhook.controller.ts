import express from "express";
import * as crypto from "crypto";
import { ApiTags } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { WebhookService } from "./webhook.service";
import { BadRequestException, Controller, Post, Request, Response } from "@nestjs/common";

@ApiTags("Webhook")
@Controller("webhook")
export class WebhookController {
  constructor(
    private readonly configService: ConfigService,
    private readonly webhookService: WebhookService
  ) {}

  @Post("paystack")
  async handlePayStackWebhook(@Request() req: express.Request, @Response() res: express.Response) {
    console.log("Webhook hit");
    const secret = this.configService.get<string>("PAYSTACK_SECRET_KEY");

    if (!req.body) throw new BadRequestException("Invalid request body");

    const hash = crypto.createHmac("sha512", secret).update(JSON.stringify(req.body)).digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) throw new BadRequestException("Invalid paystack signature");

    const events = req.body;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const metadata = events.data.metadata;

    if (events.event === "charge.success") {
      const data = events.data;

      await this.webhookService.paystackProcessDeposit(data);
    } else if (events.event === "transfer.success") {
      const data = events.data;

      await this.webhookService.paystackProcessWithdrawal(data);
    } else if (events.event === "transfer.failed" || events.event === "transfer.reversed") {
      console.log("it hit webhook");

      const data = events.data;

      const status = events.event === "transfer.failed" ? "failed" : "refunded";

      await this.webhookService.paystackProcessFailedWithdrawal(data, status);
    }

    res.status(200).json({ message: true });
  }
}
