import { Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModuleOptions, ThrottlerStorage } from "@nestjs/throttler";

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  constructor(throttlerOptions: ThrottlerModuleOptions, storageService: ThrottlerStorage, reflector: Reflector) {
    super(throttlerOptions, storageService, reflector);
  }

  protected errorMessage: string = "Too many requests";
}

//   protected async getTracker(req: Record<string, any>): Promise<string> {
//     const ip = req.ip;
//     const userId = req.user?.id || "anonymous";
//     const route = req.originalUrl;
//     return `${ip}-${userId}-${route}`;
//   }

//   protected async handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
//     const tracker = await this.getTracker(requestProps);

//     // Get the stored record or create a new one
//     const record: ThrottlerStorageRecord = await this.storageService.increment(
//       tracker,
//       requestProps.ttl,
//       requestProps.limit,
//       0, // blockDuration
//       requestProps.throttler.name || "default"
//     );

//     // Check if the request should be throttled
//     if (record.totalHits > requestProps.limit) {
//       // Create throttle details for the exception
//       const throttlerLimitDetail = {
//         totalHits: record.totalHits,
//         limit: requestProps.limit,
//         ttl: requestProps.ttl,
//         key: tracker,
//         tracker,
//         timeToExpire: requestProps.ttl,
//         isBlocked: false,
//         timeToBlockExpire: 0,
//       };

//       await this.throwThrottlingException(requestProps.context, throttlerLimitDetail);
//     }

//     return true;
//   }
// }
