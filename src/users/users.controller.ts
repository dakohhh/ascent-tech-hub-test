import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request, Controller, Get, UseGuards, HttpStatus, Patch, Body, UseInterceptors, UploadedFile, ParseFilePipeBuilder, Post, Delete, Param } from "@nestjs/common";

import { CONFIGS } from "../../configs";
import { User } from "./user.schema";
import { UsersService } from "./users.service";
import { JWTRoleGuard } from "src/auth/guards/jwt-role.guard";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { HttpResponse } from "src/common/dto/http-response.dto";
import { GetAllUsersResponseDto, UpdateUserDto, UserAddImageDto, UserUpdateImageDto } from "./user.dto";
import { ApiHttpErrorResponses, ApiHttpResponse, ApiPaginationQuery, PaginationQuery } from "src/common/decorators/custom-decorator";

@ApiTags("Users")
@Controller({ path: "users", version: "1" })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "Get User Session" })
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: 200, type: User, description: "Returns the user session" })
  @Get("session")
  @UseGuards(JwtAuthGuard)
  async getUserSession(@Request() req: Request & { user: User }) {
    return new HttpResponse("User session", req.user, HttpStatus.OK);
  }

  @ApiOperation({ summary: "Update User" })
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: 200, type: User, description: "Updates the user information" })
  @Patch("update-profile")
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async updateUserProfile(@Body() updateUserDto: UpdateUserDto, @Request() req: Request & { user: User }) {
    const result = await this.usersService.updateUser(req.user, { ...updateUserDto });
    return new HttpResponse("User profile updated", result, HttpStatus.OK);
  }

  @ApiOperation({ summary: "Add User Image" })
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: 200, type: User, description: "Adds an image to the user profile" })
  @Post("images")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async addUserImage(
    @Body() body: UserAddImageDto,
    @Request() req: Request & { user: User },
    @UploadedFile(new ParseFilePipeBuilder().addFileTypeValidator({ fileType: "image/*" }).addMaxSizeValidator({ maxSize: 1000000 }).build({ fileIsRequired: true, errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })) file: Express.Multer.File
  ) {
    const result = await this.usersService.userAddImage(req.user, { file });
    return new HttpResponse("User image added", result, HttpStatus.OK);
  }

  @ApiOperation({ summary: "Update User Image" })
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: 200, type: User, description: "Updates an image in the user profile" })
  @Patch("images/:image_url")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async updateUserImage(
    @Body() body: UserUpdateImageDto,
    @Request() req: Request & { user: User },
    @UploadedFile(new ParseFilePipeBuilder().addFileTypeValidator({ fileType: "image/*" }).addMaxSizeValidator({ maxSize: 1000000 }).build({ fileIsRequired: true, errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })) file: Express.Multer.File
  ) {
    const result = await this.usersService.userUpdateImage(req.user, { ...body, file });
    return new HttpResponse("User image updated", result, HttpStatus.OK);
  }

  @ApiOperation({ summary: "Delete User Image" })
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: 200, type: User, description: "Deletes an image from the user profile" })
  @Delete("images/:images_url")
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async deleteUserImage(@Param("images_url") imageUrl: string, @Request() req: Request & { user: User }) {
    console.log("imageUrl", imageUrl);
    const result = await this.usersService.userDeleteImage(req.user, imageUrl);
    return new HttpResponse("User image deleted", result, HttpStatus.OK);
  }

  @ApiOperation({ summary: "Get All Users" })
  @ApiBearerAuth()
  @ApiPaginationQuery()
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: 200, type: GetAllUsersResponseDto, description: "Returns all users" })
  @Get("all")
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.SUPER_ADMIN))
  async getAllUsers(@PaginationQuery() paginationDto: PaginationDto) {
    const result = await this.usersService.getAllUsers(paginationDto);
    return new HttpResponse("All users", result, HttpStatus.OK);
  }
}
