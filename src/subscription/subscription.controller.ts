import { CONFIGS } from "configs";
import { ApiTags } from "@nestjs/swagger";
import { User } from "src/users/user.schema";
import { CreateSubscriptionDto } from "./subscription.dto";
import { SubscriptionService } from "./subscription.service";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { JWTRoleGuard } from "src/auth/guards/jwt-role.guard";
import { HttpResponse } from "src/common/dto/http-response.dto";
import { ApiHttpErrorResponses } from "src/common/decorators/custom-decorator";
import { Controller, HttpStatus, Post, UseGuards, Request, Body } from "@nestjs/common";

@ApiTags("Subscription")
@Controller("subscription")
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post("")
  @ApiOperation({ summary: "Create Subscription" })
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async createSubscription(@Request() request: Request & { user: User }, @Body() createSubscriptionDto: CreateSubscriptionDto) {
    await this.subscriptionService.createSubscription(request.user, createSubscriptionDto);
    return new HttpResponse("Create Subscription Successfully", null, HttpStatus.OK);
  }
}
