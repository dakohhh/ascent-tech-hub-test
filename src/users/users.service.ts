import bcryptjs from "bcryptjs";
import { Model } from "mongoose";
import { User } from "./user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { UpdateUserDto } from "./dto/user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PaginationDto, PaginationResponseDto } from "src/common/dto/pagination.dto";
import { Paginator } from "src/common/utils/pagination";
// import { IPaginationResult, Paginator } from "src/common/utils/pagination";

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).select(["-password"]);
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async getAllUsers(paginationDto: PaginationDto) {
    const paginator = new Paginator<User>(this.userModel, paginationDto.page, paginationDto.limit, { filter: {}, projection: { password: 0 } });

    const result = await paginator.paginate();

    const pagination: PaginationResponseDto<User> = {
      data: result.data,
      meta: result.meta,
    };

    return pagination;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUserEmail = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUserEmail) {
      throw new BadRequestException("Email already exists");
    }

    // Check if phone number already exists
    const existingUserPhoneNumber = await this.userModel.findOne({ phoneNumber: createUserDto.phoneNumber });
    if (existingUserPhoneNumber) {
      throw new BadRequestException("Phone number already exists");
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(createUserDto.password, this.configService.get("CONFIGS.BCRYPT_SALT"));

    // Create user with hashed password
    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword as User;
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    // Check if user exists
    const foundUser = await this.userModel.findById(userId);
    if (!foundUser) throw new NotFoundException("User not found");

    // Verify new email is not taken
    if (updateUserDto.email) {
      const existingUserEmail = await this.userModel.findOne({ email: updateUserDto.email });
      if (existingUserEmail) throw new BadRequestException("Email already exists");
    }

    // Verify new phone number is not taken
    if (updateUserDto.phoneNumber) {
      const existingUserPhoneNumber = await this.userModel.findOne({ phoneNumber: updateUserDto.phoneNumber });
      if (existingUserPhoneNumber) throw new BadRequestException("Phone number already exists");
    }

    // Hash new password if provided
    if (updateUserDto.password) {
      const hashedPassword = await bcryptjs.hash(updateUserDto.password, this.configService.get("CONFIGS.BCRYPT_SALT"));
      updateUserDto.password = hashedPassword;
    }

    // Update and return user
    return await this.userModel.findByIdAndUpdate(userId, updateUserDto, { new: true });
  }

  async deleteUser(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const deletedUser = await this.userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new NotFoundException("User not found");
    }

    // Return deleted user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = deletedUser.toObject();
    return userWithoutPassword as User;
  }

  // async getAllUsersFilter(userFilterDto: UserFilterDto, paginationDto: PaginationDto): Promise<IPaginationResult<User>> {
  //   const paginator = new Paginator(this.userModel, paginationDto.page, paginationDto.limit, { filter: { ...userFilterDto } });

  //   const result = await paginator.paginate();

  //   return result;
  // }
}
