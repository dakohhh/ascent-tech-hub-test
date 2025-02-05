import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { AwsService } from "src/aws/aws.service";
import { Profile } from "./profile.schema";
import { Model } from "mongoose";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PaginationDto, PaginationResponseDto } from "src/common/dto/pagination.dto";
import { User } from "src/users/user.schema";
import { CreateProfileDto, UpdateProfileDto } from "./dto/profile.dto";
import { ObjectCannedACL } from "@aws-sdk/client-s3";

@Injectable()
export class ProfileService {
  constructor(
    private readonly awsService: AwsService,
    private readonly configService: ConfigService,
    @InjectModel(Profile.name) private readonly Profile: Model<Profile>
  ) {}

  async createProfile(user: User, createProfileDto: CreateProfileDto, isDefault: boolean, file?: Express.Multer.File): Promise<any> {
    let profileImage: string = null;

    if (file) {
      profileImage = await this.uploadProfileImage(file);
    }

    const createdProfile = new this.Profile({ ...createProfileDto, user: user._id, profileImage, isDefault });
    return createdProfile.save();
  }
  async getAllProfiles(): Promise<Profile[]> {
    return this.Profile.find().exec();
  }

  async getAllUserProfile(user: User): Promise<Profile[]> {
    return this.Profile.find({ user: user._id }).exec();
  }

  async getProfile(user: User, profileId: string) {
    return this.Profile.findOne({ user: user._id, _id: profileId }).lean().exec();
  }

  async updateProfile(user: User, profileId: string, updateProfileDto: UpdateProfileDto) {
    const updatedProfile = await this.Profile.findOneAndUpdate({ user: user._id, _id: profileId }, updateProfileDto, { new: true });
    if (!updatedProfile) throw new NotFoundException("Profile not found");
    return updatedProfile;
  }

  async updateProfileImage(user: User, profileId: string, file?: Express.Multer.File) {
    // Check if the prole exist

    const profile = await this.getProfile(user, profileId);

    if (!profile) throw new NotFoundException("Profile not found");

    const previousImage = profile.profileImage;

    const profileImage = await this.uploadProfileImage(file);

    const updatedProfile = await this.Profile.findOneAndUpdate({ user: user._id, _id: profileId }, { profileImage }, { new: true });

    // Delete the previous Image (Schedule a background Task or Async Queue)
    await this.deleteProfileImage(previousImage);
    return updatedProfile;
  }

  async uploadProfileImage(file?: Express.Multer.File) {
    return this.awsService.uploadFileToS3({ s3Bucket: this.configService.get<string>("CONFIGS.AWS.S3_BUCKET"), file: file, folder: "profile", ACL: ObjectCannedACL.public_read });
  }

  async deleteProfileImage(profileImage: string) {
    await this.awsService.deleteFileFromS3({ s3Bucket: this.configService.get<string>("CONFIGS.AWS.S3_BUCKET"), Location: profileImage });
  }

  async deleteProfile(user: User, profileId: string): Promise<void> {
    // Check if the prole exist

    const profile = await this.getProfile(user, profileId);

    if (!profile) throw new NotFoundException("Profile not found");

    if (profile.isDefault) throw new BadRequestException("You cannot delete your default profile");

    const profileImage = profile.profileImage;

    await this.Profile.deleteOne({ user: user._id, _id: profile._id });

    // Delete the previous Image (Schedule a background Task or Async Queue)
    await this.deleteProfileImage(profileImage);
  }
}
