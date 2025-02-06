import "./sentry";
import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import basicAuth from "express-basic-auth";
import { ConfigService } from "@nestjs/config";
import { CONFIGS, APP_VERSION } from "../configs";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { RedisIoAdapter } from "./common/adapters/redis-adapter";
import { AllExceptionFilter } from "./common/filters/all-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.use([CONFIGS.SWAGGER.PATH, `${CONFIGS.SWAGGER.PATH}-json`, `${CONFIGS.SWAGGER.PATH}-yaml`], basicAuth({ challenge: true, users: { [CONFIGS.SWAGGER.USERNAME]: CONFIGS.SWAGGER.PASSWORD } }));

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);
  app.enableCors({ credentials: true, origin: [...CONFIGS.CORS_ALLOWED_ORIGINS] });
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionFilter());

  const swaggerConfig = new DocumentBuilder().setTitle(CONFIGS.APP_NAME).setDescription(CONFIGS.APP_DESCRIPTION).setVersion(APP_VERSION).setExternalDoc("View in YAML", `${CONFIGS.SWAGGER.PATH}-yaml`).addBearerAuth().build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(CONFIGS.SWAGGER.PATH, app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const PORT = configService.get("CONFIGS.PORT");
  const HOST = configService.get("CONFIGS.HOST");

  await app.listen(PORT);

  console.log(`Application started at: ${HOST}:${PORT}`);
}
bootstrap();
