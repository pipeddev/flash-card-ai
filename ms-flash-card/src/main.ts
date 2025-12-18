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
    origin: [
      'http://localhost:8081',
      'http://localhost:5173',
      'https://flash-card-e67ed.web.app',
      'https://flash-card-e67ed.firebaseapp.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
