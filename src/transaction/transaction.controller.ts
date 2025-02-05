import { Controller, Get, HttpStatus, Param, Query, Request, UseGuards } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiHttpErrorResponses, ApiHttpResponse } from "src/common/decorators/custom-decorator";
import { User } from "src/users/user.schema";
import { HttpResponse } from "src/common/dto/http-response.dto";
import { CONFIGS } from "configs";
import { JWTRoleGuard } from "src/auth/guards/jwt-role.guard";
import { TransactionFilterDto } from "./transaction.dto";

@ApiTags("Transaction")
@Controller("transaction")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  @Get(":transactionId")
  @ApiOperation({ summary: "Get User Session" })
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  @ApiHttpResponse({ status: 200, type: User, description: "Returns the user session" })
  async getTransaction(@Request() request: Request & { user: User }, @Param("transactionId") transactionId: string) {
    const result = await this.transactionService.getTransactionByUser(request.user, transactionId);
    return new HttpResponse("Get transaction successfully", result, HttpStatus.OK);
  }

  @Get()
  @ApiOperation({ summary: "Get all user transactions" })
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  @ApiHttpResponse({ status: 200, type: User, description: "Returns the user session" })
  async getTransactions(@Request() request: Request & { user: User }, @Query() transactionFilterDto: TransactionFilterDto) {
    const result = await this.transactionService.getAllTransactionsByUser(request.user, transactionFilterDto);
    return new HttpResponse("Get transaction successfully", result, HttpStatus.OK);
  }
}
