import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filters';
import { Logger, VersioningType } from '@nestjs/common';
import { Environment } from './shared/config/environment';
import { TransformPlainToInstancePipe } from './shared/pipes/transform-plain-to-instance.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new TransformPlainToInstancePipe());

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
    defaultVersion: '1',
  });

  await app.listen(Environment.APP_PORT ?? 3000, '0.0.0.0');

  Logger.log(
    `Server running on http://localhost:${Environment.APP_PORT || 3000}`,
    'Bootstrap',
  );
}
void bootstrap();
