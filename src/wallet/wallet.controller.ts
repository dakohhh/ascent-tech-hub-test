import { Body, Controller, Get, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiHttpErrorResponses, ApiHttpResponse } from "src/common/decorators/custom-decorator";
import { User } from "src/users/user.schema";
import { WalletService } from "./wallet.service";
import { FundWalletViaBankTransferDto, SetArewaFlixPinDto, SendFundsToUserDto, ConfirmWalletIdDto } from "./wallet.dto";
import { CONFIGS } from "configs";
import { JWTRoleGuard } from "src/auth/guards/jwt-role.guard";
import { DVA } from "src/dva/dva.schemas";
import { HttpResponse } from "src/common/dto/http-response.dto";

@ApiTags("Wallet")
@Controller("wallet")
export class WalletController {
  constructor(private readonly walletService: WalletService) {}
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: 200, type: User, description: "Funds user wallet via bank transfer" })
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  @Post()
  async fundWalletViaBankTransfer(@Request() request: Request & { user: User }, @Body() fundWalletViaBankTransferDto: FundWalletViaBankTransferDto) {
    await this.walletService.payWithTransferViaPaystack(request.user, fundWalletViaBankTransferDto.amount);
    // this.walletService  //TODO: Implement this method
  }

  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: 200, type: DVA, description: "Gets DVA of the user" })
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  @Get("dva")
  async getDVA(@Request() request: Request & { user: User }) {
    const dva = await this.walletService.getDVA(request.user);
    return new HttpResponse("Get DVA information", dva);
  }

  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: 200, type: "null", description: "Sets the Arewa Flix Pin of the user" })
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  @Post("set-arewa-flix-pin")
  async setArewaFlixPin(@Request() request: Request & { user: User }, @Body() setArewaFlixDto: SetArewaFlixPinDto) {
    await this.walletService.setArewaFlixPin(request.user, setArewaFlixDto);

    return new HttpResponse("Your wallet is now protected", null, HttpStatus.CREATED);
  }

  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: 200, type: User, description: "Send funds from user wallet to another Arewa Flix Pin user" })
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  @Post("send-funds")
  async sendFundsToUser(@Request() request: Request & { user: User }, @Body() sendFundsToUserDto: SendFundsToUserDto) {
    await this.walletService.sendFundsToUser(request.user, sendFundsToUserDto);

    return new HttpResponse("Funds sent successfully", null, HttpStatus.CREATED);
  }

  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: 200, type: User, description: "Confirms Wallet ID" })
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  @Post("confirm-wallet-id")
  async confirmWalletId(@Request() request: Request & { user: User }, @Body() confirmWalletIdDto: ConfirmWalletIdDto) {
    const result = await this.walletService.confirmWalletId(request.user, confirmWalletIdDto);

    return new HttpResponse("Confirmed Wallet ID", result, HttpStatus.CREATED);
  }
}
