// Mock process.env for tests
process.env.NODE_ENV = "test";

// Mock ConfigService
jest.mock("@nestjs/config", () => ({
  ConfigService: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockImplementation((key: string) => {
      const configs = {
        "CONFIGS.BCRYPT_SALT": "10",
        "CONFIGS.JWT_SECRET": "test-secret",
        // Add other config values needed for tests
      };
      return configs[key] || null;
    }),
  })),
}));

// Mock bcryptjs
jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockImplementation(() => Promise.resolve("hashedPassword")),
  compare: jest.fn().mockImplementation(() => Promise.resolve(true)),
}));
