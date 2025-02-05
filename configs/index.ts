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
  APP_NAME: "",
  APP_DESCRIPTION: ".",
  SUPPORT_EMAIL: "",
  DEFAULT_EMAIL_FROM: "",

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
    CONTENT_MANAGER: "content-manager",
  },

  AWS: {
    AWS_REGION: process.env.AWS_REGION,
    S3_BUCKET: process.env.AWS_S3_BUCKET_NAME,
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    CLOUD_FRONT_URL: process.env.AWS_CLOUD_FRONT_URL,
  },
  PAYSTACK: {
    PAYSTACK_BASE_URL: process.env.PAYSTACK_BASE_URL || "https://api.paystack.co",
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
  },

  STRIPE: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
  },

  ALGOLIA: {
    ALGOLIA_API_KEY: process.env.ALGOLIA_API_KEY,
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
  },

  // APPLE: {
  //   PRIVATE_KEY: process.env.APPLE_PRIVATE_KEY!,
  //   TEAM_ID: process.env.APPLE_TEAM_ID!,
  //   KEY_ID: process.env.APPLE_KEY_ID!,
  //   CLIENT_ID: process.env.APPLE_CLIENT_ID!,
  //   CALLBACK_URL: process.env.APPLE_CALLBACK_URL!,
  // },
};

const CONFIG_BUILDER = {
  development: {
    ...GLOBAL_CONSTANTS,

    // System Constants
    // ============================================================
    URL: {
      API_BASE_URL: "https://localhost:4000",
      AUTH_BASE_URL: "https://localhost:3000",
      LANDING_BASE_URL: "https://localhost:3000",
    },

    // Security / Auth Configs
    // ============================================================
    JWT_SECRET: "T4u2Rcnne09F.FBr11f0VvERyUiq",

    // DB Constants
    // ============================================================
    REDIS_URI: "redis://127.0.0.1:6379",
    MONGO_URI: "mongodb://localhost:27017/arewaflix",

    // mongodb+srv://admin-dprince:%3Cdb_password%3E@cluster0.5uocq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

    // Mailer Configs
    // ============================================================
    MAILER: {
      SMTP_HOST: "localhost",
      SMTP_PORT: 2525,
      SMTP_USER: "user",
      SMTP_PASSWORD: "pass",
      SECURE: false,
      FROM_EMAIL: "ArewaFlix <no-reply@arewaflix.com>",
    },

    // App Level Configs
    // ============================================================
    CORS_ALLOWED_ORIGINS: ["https://admin.socket.io", "http://localhost:3000"],

    SOCKET_IO: {
      USERNAME: "admin",
      PASSWORD: "password",
    },

    SWAGGER: {
      PATH: "/docs",
      PASSWORD: "password",
    },

    // GOOGLE: {
    //   CLIENT_ID: "418901255882-c61v4mn8p1a1lg3dnfng285mbah0sujf.apps.googleusercontent.com",
    //   CLIENT_SECRET: "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",
    //   CALLBACK_URL: "http://localhost:4000/v1/auth/google/callback",
    // },

    // STRIPE: {
    //     PUBLIC_KEY: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    //     SECRET_KEY: "sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    // },
  },

  production: {
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

    // Mailer Configs
    // ============================================================
    MAILER: {
      SMTP_HOST: process.env.MAILER_SMTP_HOST,
      SMTP_PORT: process.env.MAILER_SMTP_PORT,
      SMTP_USER: process.env.MAILER_SMTP_USER,
      SMTP_PASSWORD: process.env.MAILER_SMTP_PASSWORD,
      SECURE: process.env.MAILER_SECURE === "true" ? true : false,
      USE_AWS_SES: process.env.MAILER_USE_AWS_SES === "true" ? true : false,
      FROM_EMAIL: "EatNVibe <no-reply@eatandvibe.com>",
    },

    // App Level Configs
    // ============================================================
    CORS_ALLOWED_ORIGINS: ["https://admin.socket.io", "https://example.com"],

    SOCKET_IO: {
      USERNAME: process.env.SOCKET_IO_USERNAME!,
      PASSWORD: process.env.SOCKET_IO_PASSWORD!,
    },

    SWAGGER: {
      PATH: "/docs",
      PASSWORD: process.env.SWAGGER_PASSWORD!,
    },

    GOOGLE: {
      CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
      CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
      CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL!,
    },

    // e.g
    // STRIPE: {
    //     PUBLIC_KEY: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    //     SECRET_KEY: "sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    // },
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
