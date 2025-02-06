import { User } from "./user.schema";
import { CONFIGS } from "../../configs";
import { UsersService } from "./users.service";
import { JWTRoleGuard } from "src/auth/guards/jwt-role.guard";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { PaginationDto, PaginationResponseDto } from "src/common/dto/pagination.dto";
import { HttpResponse } from "src/common/dto/http-response.dto";
import { UpdateUserDto } from "./dto/user.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request, Controller, Get, UseGuards, HttpStatus, Body, Param, Put, Post, Delete, BadRequestException } from "@nestjs/common";
import { ApiHttpErrorResponses, ApiHttpResponse, ApiPaginationQuery, PaginationQuery } from "src/common/decorators/custom-decorator";
import { CreateUserDto } from "./dto/create-user.dto";

@ApiTags("Users")
@Controller({ path: "api/users" })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "Get Current Logged In User Session" })
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: 200, type: User, description: "Returns the user session" })
  @Get("session")
  @UseGuards(JwtAuthGuard)
  async getUserSession(@Request() req: Request & { user: User }) {
    return new HttpResponse("User session", req.user, HttpStatus.OK);
  }

  @ApiOperation({ summary: "Get All Users" })
  @ApiBearerAuth()
  @ApiPaginationQuery()
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: 200, type: PaginationResponseDto, description: "Returns all users" })
  @Get("")
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.SUPER_ADMIN))
  async getAllUsers(@PaginationQuery() paginationDto: PaginationDto) {
    const result = await this.usersService.getAllUsers(paginationDto);
    return new HttpResponse("All users", result, HttpStatus.OK);
  }

  @ApiOperation({ summary: "Create User" })
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: 201, type: User, description: "Creates a new user" })
  @Post()
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.SUPER_ADMIN))
  async createUser(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.createUser(createUserDto);
    return new HttpResponse("User created successfully", result, HttpStatus.CREATED);
  }

  @ApiOperation({ summary: "Get a User" })
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: 200, type: User, description: "Returns a user" })
  @Get(":userId")
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.SUPER_ADMIN))
  async getUser(@Param("userId") userId: string) {
    const result = await this.usersService.getUserById(userId);
    return new HttpResponse("User", result, HttpStatus.OK);
  }

  @ApiOperation({ summary: "Update User" })
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: 200, type: User, description: "Updates the user information" })
  @Put(":userId")
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async updateUserProfile(@Body() updateUserDto: UpdateUserDto, @Param("userId") userId: string) {
    const result = await this.usersService.updateUser(userId, { ...updateUserDto });
    return new HttpResponse("User profile updated", result, HttpStatus.OK);
  }

  @ApiOperation({ summary: "Delete User" })
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: 200, type: User, description: "Deletes a user" })
  @Delete(":userId")
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.SUPER_ADMIN))
  async deleteUser(@Param("userId") userId: string, @Request() req: Request & { user: User }) {
    if (userId === req.user._id.toString()) {
      throw new BadRequestException("You cannot delete your own account");
    }
    const result = await this.usersService.deleteUser(userId);
    return new HttpResponse("User deleted successfully", result, HttpStatus.OK);
  }
}
