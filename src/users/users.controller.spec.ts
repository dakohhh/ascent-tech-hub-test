import { Test } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { createMockUser } from "../common/test/test-utils";
import { BadRequestException } from "@nestjs/common";

describe("UsersController", () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    getUserById: jest.fn(),
    getAllUsers: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("deleteUser", () => {
    it("should throw BadRequestException when trying to delete own account", async () => {
      const mockUser = createMockUser();
      const req = { user: mockUser };

      await expect(usersController.deleteUser(mockUser._id.toString(), req as any)).rejects.toThrow(BadRequestException);
    });

    it("should delete user successfully", async () => {
      const mockUser = createMockUser();
      const differentUserId = "different-user-id";
      const req = { user: mockUser };

      mockUsersService.deleteUser.mockResolvedValue(mockUser);

      const result = await usersController.deleteUser(differentUserId, req as any);
      expect(result.data).toEqual(mockUser);
      expect(usersService.deleteUser).toHaveBeenCalledWith(differentUserId);
    });
  });

  // Add more test cases for other methods...
});
