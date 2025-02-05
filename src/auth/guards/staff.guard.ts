import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { User } from "src/users/user.schema";

@Injectable()
export class StaffGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const user: User = request.user;

    return user.isStaff;
  }
}
