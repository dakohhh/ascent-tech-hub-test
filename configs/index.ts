/* eslint-disable @typescript-eslint/no-non-null-assertion */
import ms from "ms";
import { config } from "dotenv";
import packageInfo from "../package.json";

config();

// How to use this:
// ============================================================
// This file is used to store all the environment variables and constants used in the application.

// # To add a new variable:
// ============================================================
// - For environment variables & constants that are the same across all environments, add them to the GLOBAL_CONSTANTS object.
// - For environment-specific variables (i.e they change depending on the environment), add them to the environment's object in each of the CONFIG_BUILDER object.

// # To add a new environment:
// ============================================================
// 1. Add a new key to the CONFIG_BUILDER object with the environment name.
// 2. Duplicate the development object and replace the values with the new environment's values.

const APP_VERSION = packageInfo.version;
const DEPLOYMENT_ENV = process.env.NODE_ENV || "development";

const GLOBAL_CONSTANTS = {
  // System Constants
  // ============================================================
  APP_NAME: "Ascent",
  APP_DESCRIPTION: ".",
  SUPPORT_EMAIL: "",
  DEFAULT_EMAIL_FROM: "",
  PORT: +process.env.PORT || 4000,

  // AI
  // ============================================================

  // Server Constants
  // ============================================================
  SERVER_BACKEND_TEAM_EMAILS: [], // TODO: Add alerts notification emails here

  // Security / Auth Configs
  // ============================================================
  BCRYPT_SALT: 10,
  ACCESS_TOKEN_JWT_EXPIRES_IN: ms("1h"),
  REFRESH_TOKEN_JWT_EXPIRES_IN: ms("30d"),
  DEFAULT_DB_TOKEN_EXPIRY_DURATION: ms("15m"),

  // Sentry & Monitoring Configs
  // ============================================================
  SENTRY: {
    RELEASE: APP_VERSION,
    DSN: "https://examplePublicKey@o0.ingest.sentry.io/0",
  },

  // App Level Configs
  // ============================================================
  ROLES: {
    USER: "user",
    SUPER_ADMIN: "super-admin",
  },
};

const CONFIG_BUILDER = {
  development: {
    ...GLOBAL_CONSTANTS,

    HOST: "127.0.0.1",

    // System Constants
    // ============================================================
    URL: {
      API_BASE_URL: "https://localhost:4000",
      AUTH_BASE_URL: "https://localhost:3000",
      LANDING_BASE_URL: "https://localhost:3000",
    },

    // Security / Auth Configs
    // ============================================================
    JWT_SECRET: "secret",

    // DB Constants
    // ============================================================
    REDIS_URI: "redis://127.0.0.1:6379",
    MONGO_URI: "mongodb://localhost:27017/ascent",

    // App Level Configs
    // ============================================================
    CORS_ALLOWED_ORIGINS: ["https://admin.socket.io", "http://localhost:3000"],

    SWAGGER: {
      PATH: "/docs",
      USERNAME: "admin",
      PASSWORD: "password",
    },
  },

  production: {
    HOST: process.env.HOST || "0.0.0.0",

    ...GLOBAL_CONSTANTS,

    // System Constants
    // ============================================================
    URL: {
      AUTH_BASE_URL: "",
      LANDING_BASE_URL: "",
      API_BASE_URL: "",
    },

    // Security / Auth Configs
    // ============================================================
    JWT_SECRET: process.env.JWT_SECRET!,

    // DB Constants
    // ============================================================
    REDIS_URI: process.env.REDIS_URI!,
    MONGO_URI: process.env.MONGO_URI!,

    // App Level Configs
    // ============================================================
    CORS_ALLOWED_ORIGINS: ["https://admin.socket.io", "https://example.com"],

    // SOCKET_IO: {
    //   USERNAME: process.env.SOCKET_IO_USERNAME!,
    //   PASSWORD: process.env.SOCKET_IO_PASSWORD!,
    // },

    SWAGGER: {
      PATH: "/docs",
      USERNAME: process.env.SWAGGER_USERNAME!,
      PASSWORD: process.env.SWAGGER_PASSWORD!,
    },
  },

  test: {
    ...GLOBAL_CONSTANTS,

    HOST: "127.0.0.1",

    PORT: 3000,
    JWT_SECRET: "test-secret",
    MONGO_URI: "mongodb://localhost:27017/test-db",
    REDIS_URI: "redis://localhost:6379",

    // System Constants
    // ============================================================
    URL: {
      API_BASE_URL: "",
      AUTH_BASE_URL: "",
      LANDING_BASE_URL: "",
    },

    // App Level Configs
    // ============================================================
    CORS_ALLOWED_ORIGINS: ["", ""],

    SWAGGER: {
      PATH: "/docs",
      USERNAME: "admin",
      PASSWORD: "password",
    },
  },
} as const;

// Check if DEPLOYMENT_ENV is valid
if (!Object.keys(CONFIG_BUILDER).includes(DEPLOYMENT_ENV)) {
  throw new Error(`Invalid NODE_ENV: ${DEPLOYMENT_ENV}`);
}

const CONFIGS = CONFIG_BUILDER[DEPLOYMENT_ENV as keyof typeof CONFIG_BUILDER];

// Uncomment below to check configs set
// console.log("CONFIGS:", CONFIGS);

export { DEPLOYMENT_ENV, APP_VERSION, CONFIGS };

export default () => ({ DEPLOYMENT_ENV, APP_VERSION, CONFIGS });
