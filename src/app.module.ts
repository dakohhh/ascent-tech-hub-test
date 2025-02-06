import { APP_FILTER } from "@nestjs/core";
import { RedisClientOptions } from "redis";
import { ConfigModule } from "@nestjs/config";
import { CommandModule } from "nestjs-command";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { AppController } from "./app.controller";
import { UsersModule } from "./users/users.module";
import { TokenModule } from "./token/token.module";
import { CacheModule } from "@nestjs/cache-manager";
import configuration, { CONFIGS } from "../configs";
import { CommonModule } from "./common/common.module";
import * as redisStore from "cache-manager-redis-store";
import { DatabaseModule } from "./database/database.module";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { SentryGlobalFilter, SentryModule } from "@sentry/nestjs/setup";
import { LoggerMiddleware } from "./common/middlewares/logger.middleware";

@Module({
  imports: [SentryModule.forRoot(), CacheModule.register<RedisClientOptions>({ isGlobal: true, store: redisStore, url: CONFIGS.REDIS_URI }), UsersModule, DatabaseModule, AuthModule, TokenModule, ConfigModule.forRoot({ isGlobal: true, load: [configuration] }), CommandModule, CommonModule],
  controllers: [AppController],
  providers: [{ provide: APP_FILTER, useClass: SentryGlobalFilter }, AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
