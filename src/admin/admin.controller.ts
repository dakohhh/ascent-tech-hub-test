import { Controller, Delete, Get, HttpStatus, Param, Patch, Query, Request } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { User } from "src/users/user.schema";
import { HttpResponse } from "src/common/dto/http-response.dto";
import { UserFilterDto } from "src/users/user.dto";
import { ApiTags } from "@nestjs/swagger";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { TransactionFilterDto } from "src/transaction/transaction.dto";

@ApiTags("Admin")
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("users")
  async getAllUsers(@Request() request: Request & { user: User }, @Query() userFilterDto: UserFilterDto, @Query() paginationDto: PaginationDto) {
    const result = await this.adminService.getAllUsers(userFilterDto, paginationDto);
    return new HttpResponse("Get all users successfully", result);
  }

  @Get("users/:userId")
  async getUser(@Request() request: Request & { user: User }, @Param("userId") userId: string) {
    const result = await this.adminService.getUser(userId);
    return new HttpResponse("Get user Info", result);
  }

  @Patch("enableUser/:userId")
  async enableUser(@Param("userId") userId: string) {
    const result = await this.adminService.enableUser(userId);
    return new HttpResponse("Enable user successfully", result);
  }

  @Patch("disableUser/:userId")
  async disableUser(@Param("userId") userId: string) {
    const result = await this.adminService.disableUser(userId);
    return new HttpResponse("Disable user successfully", result);
  }

  @Delete("deleteUser/:userId")
  async deleteUser(@Param("userId") userId: string) {
    const result = await this.adminService.deleteUser(userId);
    return new HttpResponse("Deleted user successfully", result, HttpStatus.NO_CONTENT);
  }

  @Get("getAllTransactions")
  async getAllTransactions(@Request() request: Request & { user: User }, @Query() transactionFilterDto: TransactionFilterDto, @Query() paginationDto: PaginationDto) {
    const result = await this.adminService.getAllTransactions(transactionFilterDto, paginationDto);
    return new HttpResponse("Get all transactions successfully", result, HttpStatus.OK);
  }
}
