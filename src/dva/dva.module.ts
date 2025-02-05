import { Module } from "@nestjs/common";
import { DvaService } from "./dva.service";
import { MongooseModule } from "@nestjs/mongoose";
import { DVA, DVASchema } from "./dva.schemas";
import { User, UserSchema } from "src/users/user.schema";
import { PaystackModule } from "src/paystack/paystack.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DVA.name, schema: DVASchema },
      { name: User.name, schema: UserSchema },
    ]),
    PaystackModule,
  ],
  providers: [DvaService],
  exports: [DvaService],
})
export class DvaModule {}
