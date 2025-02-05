import { IsNumber, IsNumberString, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FundWalletViaBankTransferDto {
  @ApiProperty({ type: Number, description: "Amount to fund wallet", example: 1000 })
  @IsNumber()
  amount: number;
}

export class SetArewaFlixPinDto {
  @ApiProperty({ type: String, description: "ArewaFlix pin", example: "1234" })
  @IsNumberString()
  pin: string;
}

export class SendFundsToUserDto {
  @ApiProperty({ type: Number, description: "Amount to send", example: 1000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ type: String, description: "ArewaFlix pin of the user to send funds to", example: "1234" })
  @IsNumberString()
  pin: string;

  @ApiProperty({ type: String, description: "Wallet Id of the recipient ", example: "OHDWI2E" })
  @IsString()
  recipientWalletId: string;
}

export class ConfirmWalletIdDto {
  @ApiProperty({ type: String, description: "Wallet Id of the recipient ", example: "OHDWI2E" })
  @IsString()
  walletId: string;
}
