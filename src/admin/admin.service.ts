import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { UserFilterDto } from "src/users/user.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { TransactionFilterDto } from "src/transaction/transaction.dto";
import { TransactionService } from "src/transaction/transaction.service";

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UsersService,
    private readonly transactionService: TransactionService
  ) {}

  async getUser(userId: string) {
    const result = await this.userService.getById(userId);
    if (!result) throw new NotFoundException("User not found");
  }

  async getAllUsers(userFilterDto: UserFilterDto, paginationDto: PaginationDto) {
    return this.userService.getAllUsersFilter(userFilterDto, paginationDto);
  }

  async enableUser(userId: string) {
    const result = await this.userService.enableUser(userId);
    return result;
  }

  async disableUser(userId: string) {
    const result = await this.userService.disableUser(userId);
    return result;
  }
  async deleteUser(userId: string) {
    const result = await this.userService.deleteUser(userId);
    if (!result) throw new NotFoundException("User does not exists");
  }

  async getAllTransactions(transactionFilterDto: TransactionFilterDto, paginationDto: PaginationDto) {
    const result = await this.transactionService.getAllTransactions(transactionFilterDto, paginationDto);
    return result;
  }
}
