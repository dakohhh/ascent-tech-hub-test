import { Test } from "@nestjs/testing";
import { Model } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { User } from "../users/user.schema";
import { TokenService } from "../token/token.service";
import { createMockUser, mockAuthTokens } from "../common/test/test-utils";
import { HttpException, NotFoundException } from "@nestjs/common";
import bcryptjs from "bcryptjs";

describe("AuthService", () => {
  let authService: AuthService;
  let userModel: Model<User>;
  let tokenService: TokenService;

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockTokenService = {
    generateAuthTokens: jest.fn().mockResolvedValue(mockAuthTokens),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue("10"),
  };

  const mockCredentials = {
    email: "test@example.com",
    password: "password123",
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userModel = moduleRef.get<Model<User>>(getModelToken(User.name));
    tokenService = moduleRef.get<TokenService>(TokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("validateUser", () => {
    it("should validate user successfully", async () => {
      const mockUser = createMockUser();
      mockUserModel.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcryptjs, "compare").mockResolvedValueOnce(true as never);

      const result = await authService.validateUser(mockCredentials.email, mockCredentials.password);
      expect(result).toEqual(mockUser);
    });

    it("should throw HttpException if password is invalid", async () => {
      mockUserModel.findOne.mockResolvedValue(createMockUser());
      jest.spyOn(bcryptjs, "compare").mockResolvedValueOnce(false as never);

      await expect(authService.validateUser(mockCredentials.email, mockCredentials.password)).rejects.toThrow(HttpException);
    });
  });
}); 