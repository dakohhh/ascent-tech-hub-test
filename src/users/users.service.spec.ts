import { Test } from "@nestjs/testing";
import { Model, Types } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "./users.service";
import { User } from "./user.schema";
import { createMockUser } from "../common/test/test-utils";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import bcryptjs from "bcryptjs";

describe("UsersService", () => {
  let usersService: UsersService;
  let userModel: Model<User>;
  let configService: ConfigService;

  const mockUserModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue(10), // Mock BCRYPT_SALT value
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    userModel = moduleRef.get<Model<User>>(getModelToken(User.name));
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserById", () => {
    it("should return a user if found", async () => {
      const mockUser = createMockUser();
      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await usersService.getUserById(mockUser._id.toString());
      expect(result).toEqual(mockUser);
    });

    it("should throw NotFoundException if user not found", async () => {
      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await expect(usersService.getUserById("nonexistentId")).rejects.toThrow(NotFoundException);
    });
  });

  describe("createUser", () => {
    const createUserDto: CreateUserDto = {
      email: "test@example.com",
      phoneNumber: "+2347012345678",
      firstName: "Test",
      lastName: "User",
      password: "password123",
      gender: "male" as any,
    };

    it("should create a new user successfully", async () => {
      const mockUser = createMockUser({ ...createUserDto, password: "hashedPassword" });
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue({
        ...mockUser,
        toObject: () => mockUser,
      });

      jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedPassword" as never);

      const result = await usersService.createUser(createUserDto);
      expect(result).toBeDefined();
      expect(result.password).toBeUndefined();
      expect(mockUserModel.create).toHaveBeenCalled();
    });

    it("should throw BadRequestException if email already exists", async () => {
      mockUserModel.findOne.mockResolvedValueOnce(createMockUser());

      await expect(usersService.createUser(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  // Add more test cases for other methods...
}); 