import { Body, Controller, HttpStatus, ParseFilePipeBuilder, Post, UploadedFile, UseInterceptors, Request, UseGuards, Get, Param, Patch, Put } from "@nestjs/common";
import { User } from "src/users/user.schema";
import { AwsService } from "src/aws/aws.service";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ApiHttpErrorResponses, ApiHttpResponse } from "src/common/decorators/custom-decorator";
import { HttpResponse } from "src/common/dto/http-response.dto";
import { ProfileService } from "./profile.service";
import { CreateProfileDto, UpdateProfileDto, UpdateProfileImageDto } from "./dto/profile.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { JWTRoleGuard } from "src/auth/guards/jwt-role.guard";
import { CONFIGS } from "configs";
import { Profile } from "./profile.schema";

@ApiTags("Profile")
@Controller("profile")
export class ProfileController {
  constructor(
    private readonly awsService: AwsService,
    private readonly profileService: ProfileService
  ) {}

  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: 200, type: Profile, description: "Creates a profile for a user" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  @Post()
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async createProfile(
    @Request() request: Request & { user: User },
    @Body() createProfileDto: CreateProfileDto,
    @UploadedFile(new ParseFilePipeBuilder().addFileTypeValidator({ fileType: "image/*" }).addMaxSizeValidator({ maxSize: 1000000 }).build({ fileIsRequired: false, errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })) file?: Express.Multer.File
  ) {
    const profile = await this.profileService.createProfile(request.user, createProfileDto, false, file);
    return new HttpResponse("Profile Created SuccessFully", profile, HttpStatus.CREATED);
  }

  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: 200, type: Profile, description: "Returns all profiles for a particular user" })
  @Get()
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async getAllUserProfile(@Request() request: Request & { user: User }) {
    const profiles = await this.profileService.getAllUserProfile(request.user);
    return new HttpResponse("Get all User Profiles SuccessFully", profiles, HttpStatus.OK);
  }

  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: 200, type: Profile, description: "Returns a profile for a particular user" })
  @Get(":profileId")
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async getProfile(@Request() request: Request & { user: User }, @Param("profileId") profileId: string) {
    const profile = await this.profileService.getProfile(request.user, profileId);
    return new HttpResponse("Get Profile SuccessFully", profile, HttpStatus.OK);
  }

  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: 200, type: User, description: "Updates a profile for a particular user" })
  @Put(":profileId")
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async updateProfile(@Request() request: Request & { user: User }, @Param("profileId") profileId: string, @Body() updateProfile: UpdateProfileDto) {
    const profile = await this.profileService.updateProfile(request.user, profileId, updateProfile);
    return new HttpResponse("Update Profile SuccessFully", profile, HttpStatus.OK);
  }

  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: 200, type: User, description: "Updates a profile image on a profile for a particular user" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  @Patch(":profileId/profileImage")
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async updateProfileImage(
    @Request() request: Request & { user: User },
    @Param("profileId") profileId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() updateProfileImageDto: UpdateProfileImageDto,
    @UploadedFile(new ParseFilePipeBuilder().addFileTypeValidator({ fileType: "image/*" }).addMaxSizeValidator({ maxSize: 1000000 }).build({ fileIsRequired: false, errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })) file?: Express.Multer.File
  ) {
    const profile = await this.profileService.updateProfileImage(request.user, profileId, file);
    return new HttpResponse("Updated Profile Image SuccessFully", profile, HttpStatus.OK);
  }

  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: 200, type: User, description: "Deletes a profile for a particular user, throws exception if its a default profile" })
  @Patch(":profileId")
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async deleteProfile(@Request() request: Request & { user: User }, @Param("profileId") profileId: string) {
    await this.profileService.deleteProfile(request.user, profileId);
    return new HttpResponse("Delete Profile SuccessFully", HttpStatus.NO_CONTENT);
  }
}
