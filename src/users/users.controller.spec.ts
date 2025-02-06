import { Test } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { createMockUser } from "../common/test/test-utils";

describe("UsersController", () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    getAllUsers: jest.fn(),
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

  describe("getAllUsers", () => {
    it("should get all users successfully", async () => {
      const mockUser = createMockUser();

      mockUsersService.getAllUsers.mockResolvedValue(mockUser);

      const result = await usersController.getAllUsers({ page: 1, limit: 10 });
      expect(result.data).toEqual(mockUser);
      expect(usersService.getAllUsers).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });
  });

  // Add more test cases for other methods...
});
