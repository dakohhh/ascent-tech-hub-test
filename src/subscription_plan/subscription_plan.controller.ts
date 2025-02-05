import { CONFIGS } from "configs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Controller, Get, HttpStatus, UseGuards } from "@nestjs/common";
import { SubscriptionPlanService } from "./subscription_plan.service";
import { HttpResponse } from "src/common/dto/http-response.dto";
import { ApiOperation } from "@nestjs/swagger";
import { JWTRoleGuard } from "../auth/guards/jwt-role.guard";
import { ApiHttpErrorResponses } from "../common/decorators/custom-decorator";

@ApiTags("Subscription Plan")
@Controller("subscription-plan")
export class SubscriptionPlanController {
  constructor(private readonly subscriptionPlanService: SubscriptionPlanService) {}

  @Get("")
  @ApiOperation({ summary: "Get All Subscription Plans" })
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async getAllSubscriptionPlans() {
    const plans = await this.subscriptionPlanService.getAllSubscriptionPlans();
    return new HttpResponse("Get All Subscription Plans Successfully", plans, HttpStatus.OK);
  }
}
