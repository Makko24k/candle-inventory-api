import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/all-exceptions.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1'); // every endpoint starts with /api/v1
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // input validation
  app.useGlobalFilters(new AllExceptionsFilter()); // standard error format

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();