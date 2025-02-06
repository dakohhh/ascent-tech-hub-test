import bcryptjs from "bcryptjs";
import { Model } from "mongoose";
import randomString from "randomstring";
import { User } from "src/users/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { RegisterDto } from "./dto/register.dto";
import { TokenService } from "src/token/token.service";
import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException("User not found");

    const isPasswordMatching = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatching) throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);

    return user;
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userModel.findOne({ email: registerDto.email });
    if (existingUser) throw new HttpException("Email already exists", HttpStatus.BAD_REQUEST);

    const passwordHash = await bcryptjs.hash(registerDto.password, this.configService.get("CONFIGS.BCRYPT_SALT"));

    const walletId = randomString.generate({ length: 7, capitalization: "uppercase" });

    const context = {
      password: passwordHash,
      phoneNumber: registerDto.phoneNumber,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      email: registerDto.email,
      walletId: walletId,
    };

    const user = await new this.userModel(context).save();
    const token = await this.tokenService.generateAuthTokens(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...cleanedUser } = user.toObject();

    return { cleanedUser, token };
  }

  async login(user: User) {
    const token = await this.tokenService.generateAuthTokens(user);
    return { user, token };
  }
}
