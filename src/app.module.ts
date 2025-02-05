import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { RedisClientOptions } from "redis";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";
import * as redisStore from "cache-manager-redis-store";
import { SentryGlobalFilter, SentryModule } from "@sentry/nestjs/setup";
import { AppService } from "./app.service";
import { AwsModule } from "./aws/aws.module";
import { MailModule } from "./mail/mail.module";
import { AuthModule } from "./auth/auth.module";
import { AppController } from "./app.controller";
import { UsersModule } from "./users/users.module";
import { TokenModule } from "./token/token.module";
import configuration, { CONFIGS } from "../configs";
import { CommonModule } from "./common/common.module";
import { DatabaseModule } from "./database/database.module";
import { LoggerMiddleware } from "./common/middlewares/logger.middleware";
import { CommandModule } from "nestjs-command";
import { ProfileModule } from "./profile/profile.module";
import { VideoContentManagementModule } from "./video-content-management/video-content-management.module";
import { WalletModule } from "./wallet/wallet.module";
import { WebhookModule } from "./webhook/webhook.module";
import { TransactionModule } from "./transaction/transaction.module";
import { PaystackModule } from "./paystack/paystack.module";
import { DvaModule } from "./dva/dva.module";
import { RatingModule } from "./rating/rating.module";
import { SearchModule } from "./search/search.module";
import { GenreModule } from "./genre/genre.module";
import { AlgoliaModule } from './algolia/algolia.module';
import { CommentsModule } from './comments/comments.module';
import { MoviesModule } from './movies/movies.module';
import { WatchlistModule } from './watchlist/watchlist.module';
import { AdminModule } from './admin/admin.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { SubscriptionPlanModule } from './subscription_plan/subscription_plan.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    CacheModule.register<RedisClientOptions>({ isGlobal: true, store: redisStore, url: CONFIGS.REDIS_URI }),
    MailModule,
    UsersModule,
    DatabaseModule,
    AwsModule,
    AuthModule,
    TokenModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    CommandModule,
    CommonModule,
    ProfileModule,
    VideoContentManagementModule,
    WalletModule,
    WebhookModule,
    PaystackModule,
    DvaModule,
    TransactionModule,
    RatingModule,
    SearchModule,
    GenreModule,
    AlgoliaModule,
    CommentsModule,
    MoviesModule,
    WatchlistModule,
    AdminModule,
    SubscriptionModule,
    SubscriptionPlanModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_FILTER, useClass: SentryGlobalFilter }, AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
