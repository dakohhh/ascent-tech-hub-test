import bcryptjs from "bcryptjs";
import { ConfigService } from "@nestjs/config";
import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { MailService } from "src/mail/mail.service";
import { User } from "src/users/user.schema";
import { TokenService } from "src/token/token.service";
import { TokenType } from "src/token/schemas/token.schema";
import { PasswordResetDto, RequestPasswordResetDto } from "./dto/password-reset.dto";
import { EmailVerificationDto, RequestEmailVerificationDto } from "./dto/email-verification.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ProfileService } from "src/profile/profile.service";
import { CreateProfileDto } from "src/profile/dto/profile.dto";
import { DVA, DVADocument } from "src/dva/dva.schemas";
import { PaystackService } from "src/paystack/paystack.service";
import { PaystackCreateCustomerDto } from "src/paystack/paystack.dto";
import { DvaService } from "src/dva/dva.service";
import randomString from "randomstring";

@Injectable()
export class AuthService {
  constructor(
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly profileService: ProfileService,
    private readonly paystackService: PaystackService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(DVA.name)
    private readonly dvaModel: Model<DVADocument>,

    private readonly dvaService: DvaService
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

    // create the user default profile
    const defaultProfile = new CreateProfileDto();
    await this.profileService.createProfile(user, defaultProfile, true);

    // Create a default DVA for the user
    const createCustomerContext = new PaystackCreateCustomerDto({ email: user.email, firstname: user.firstName, lastname: user.lastName, phone: user.phoneNumber });
    await this.dvaService.create(user, createCustomerContext);

    // send email verification email
    await this.requestEmailVerification({ user_id: user._id.toString() });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, account_disabled, email_verified, ...cleanedUser } = user.toObject();

    return { cleanedUser, token };
  }

  async login(user: User) {
    const token = await this.tokenService.generateAuthTokens(user);
    return { user, token };
  }

  // async oauthLogin(user: User) {
  //   const foundUser = await this.userModel.findOne({ email: user.email });

  //   if (!foundUser) {
  //     const newUser = await new this.userModel(user).save();
  //     const token = await this.tokenService.generateAuthTokens(newUser);
  //     return { user: newUser, token };
  //   }

  //   const token = await this.tokenService.generateAuthTokens(foundUser);
  //   return { user: foundUser, token };
  // }

  async requestEmailVerification(requestEmailVerificationDto: RequestEmailVerificationDto) {
    const user = await this.userModel.findOne({ _id: requestEmailVerificationDto.user_id });
    if (!user) throw new NotFoundException("User not found");

    if (user.email_verified === true) throw new HttpException("Email already verified", HttpStatus.BAD_REQUEST);

    const verificationOtp = await this.tokenService.generateOtpToken({ user, tokenType: TokenType.EMAIL_VERIFICATION });

    await this.mailService.sendEmailVerificationEmail({ user, verificationToken: verificationOtp.code });

    return true;
  }

  async verifyEmail(emailVerificationDto: EmailVerificationDto) {
    const user = await this.userModel.findOne({ _id: emailVerificationDto.user_id });
    if (!user) throw new NotFoundException("User not found");

    if (user.email_verified === true) throw new HttpException("Email already verified", HttpStatus.BAD_REQUEST);

    const isValidToken = await this.tokenService.verifyOtpToken({
      user,
      deleteIfValidated: true,
      tokenType: TokenType.EMAIL_VERIFICATION,
      code: emailVerificationDto.verification_otp,
      token: emailVerificationDto.verification_otp,
    });
    if (!isValidToken) throw new HttpException("Invalid or expired token", HttpStatus.UNAUTHORIZED);

    await this.userModel.findByIdAndUpdate(user._id, { email_verified: true });

    return true;
  }

  async requestPasswordReset(requestResetPasswordDto: RequestPasswordResetDto) {
    const user = await this.userModel.findOne({ email: requestResetPasswordDto.email });
    if (!user) return { user_id: undefined };

    const resetToken = await this.tokenService.generateOtpToken({ user, tokenType: TokenType.PASSWORD_RESET });

    await this.mailService.sendPasswordResetEmail({ user, resetToken: resetToken.code });

    return { user_id: user.id };
  }

  async resetPassword(passwordResetDto: PasswordResetDto) {
    const user = await this.userModel.findById(passwordResetDto.user_id);
    if (!user) throw new NotFoundException("User not found");

    const isValidToken = await this.tokenService.verifyOtpToken({
      user,
      deleteIfValidated: true,
      code: passwordResetDto.reset_otp,
      token: passwordResetDto.reset_otp,
      tokenType: TokenType.PASSWORD_RESET,
    });
    if (!isValidToken) throw new HttpException("Invalid or expired token", HttpStatus.UNAUTHORIZED);

    const passwordHash = await bcryptjs.hash(passwordResetDto.new_password, this.configService.get("CONFIGS.BCRYPT_SALT"));
    await this.userModel.findByIdAndUpdate(user._id, { password: passwordHash });

    return true;
  }
}
