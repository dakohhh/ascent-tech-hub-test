import Redis from "ioredis";
import { CONFIGS } from "../../../configs";
import { ThrottlerModuleOptions } from "@nestjs/throttler";
// const redis = new Redis(CONFIGS.REDIS_URI);

export const throttlerConfig: ThrottlerModuleOptions = {
  limit: 10,
  ttl: 60,
  ignoreUserAgents: [
    // Ignore health check requests
    /health-check/i,
  ],
};
