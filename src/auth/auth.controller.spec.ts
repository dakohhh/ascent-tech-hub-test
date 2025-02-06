import { Test } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TokenService } from "../token/token.service";
import { createMockUser } from "../common/test/test-utils";

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockTokenService = {
    refreshAuthTokens: jest.fn(),
    revokeRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe("login", () => {
    it("should return login response", async () => {
      const mockUser = createMockUser();
      const mockLoginResponse = { accessToken: "token", user: mockUser };
      
      mockAuthService.login.mockResolvedValue(mockLoginResponse);
      
      const result = await authController.login({ user: mockUser } as any);
      expect(result.data).toEqual(mockLoginResponse);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });
  });
}); 