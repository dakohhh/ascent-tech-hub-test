import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";

import { User } from "./user.schema";
import { ConfigService } from "@nestjs/config";
import { AwsService } from "src/aws/aws.service";
import { UpdateUserDto, UserAddImageDto, UserFilterDto, UserUpdateImageDto } from "./user.dto";
import { PaginationDto, PaginationResponseDto } from "src/common/dto/pagination.dto";
import { IPaginationResult, Paginator } from "src/common/utils/pagination";

@Injectable()
export class UsersService {
  constructor(
    private readonly awsService: AwsService,
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async updateUser(user: User, updateUserDto: UpdateUserDto) {
    const foundUser = await this.userModel.findById(user._id);
    if (!foundUser) throw new NotFoundException("User not found");

    return await this.userModel.findByIdAndUpdate(user._id, updateUserDto, { new: true });
  }

  async userAddImage(user: User, { file }: UserAddImageDto) {
    const foundUser = await this.userModel.findById(user._id);
    if (!foundUser) throw new NotFoundException("User not found");

    const image = await this.awsService.uploadFileToS3({
      folder: "users",
      ACL: "public-read",
      file,
      s3Bucket: this.configService.get("CONFIGS.AWS.S3_BUCKET"),
    });

    if (image) {
      foundUser.images.push(image);
      await foundUser.save();
    }

    return foundUser;
  }

  async userUpdateImage(user: User, { file, image_url }: UserUpdateImageDto) {
    const foundUser = await this.userModel.findById(user._id);
    if (!foundUser) throw new NotFoundException("User not found");

    const image = await this.awsService.uploadFileToS3({
      folder: "users",
      ACL: "public-read",
      file,
      s3Bucket: this.configService.get("CONFIGS.AWS.S3_BUCKET"),
    });

    if (image) {
      const index = foundUser.images.indexOf(image_url);
      if (index !== -1) {
        foundUser.images[index] = image;
        await this.awsService.deleteFileFromS3({
          s3Bucket: this.configService.get("CONFIGS.AWS.S3_BUCKET"),
          Location: image_url,
        });
      }
      await foundUser.save();
    }

    return foundUser;
  }

  async userDeleteImage(user: User, image_url: string) {
    const foundUser = await this.userModel.findById(user._id);
    if (!foundUser) throw new NotFoundException("User not found");

    const index = foundUser.images.indexOf(image_url);
    if (index !== -1) {
      foundUser.images.splice(index, 1);
      await this.awsService.deleteFileFromS3({
        s3Bucket: this.configService.get("CONFIGS.AWS.S3_BUCKET"),
        Location: image_url,
      });
      await foundUser.save();
    }

    return foundUser;
  }

  // User Retrieval Methods
  async getById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id);
    return user;
  }

  async getAllUsers(paginationDto: PaginationDto) {
    const users = await this.userModel
      .find()
      .limit(paginationDto.limit)
      .skip((paginationDto.page - 1) * paginationDto.limit);

    const total = await this.userModel.countDocuments();

    const pagination: PaginationResponseDto = {
      total_docs: total,
      page: paginationDto.page,
      limit: paginationDto.limit,
      total_pages: Math.ceil(total / paginationDto.limit),
    };

    return { users, pagination };
  }

  async getAllUsersFilter(userFilterDto: UserFilterDto, paginationDto: PaginationDto): Promise<IPaginationResult<User>> {
    const paginator = new Paginator(this.userModel, paginationDto.page, paginationDto.limit, { filter: { ...userFilterDto } });

    const result = await paginator.paginate();

    return result;
  }

  async enableUser(userId: string) {
    return this.userModel.findByIdAndUpdate(userId, { account_disabled: false }, { new: true }).select(["_id", "account_disabled"]);
  }

  async disableUser(userId: string) {
    return this.userModel.findByIdAndUpdate(userId, { account_disabled: true }, { new: true }).select(["_id", "account_disabled"]);
  }

  async deleteUser(userId: string) {
    return this.userModel.findByIdAndDelete(userId);
  }
}
