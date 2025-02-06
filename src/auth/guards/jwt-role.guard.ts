import { User } from "src/users/user.schema";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { ExecutionContext, mixin } from "@nestjs/common";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const JWTRoleGuard = (...roles: string[]) => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest();
      const user: User = request.user;

      if (!user) return false;

      return true;
    }
  }

  return mixin(RoleGuardMixin);
};
