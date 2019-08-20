import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from './shared/validation.pipe';

import { AppModule } from './app.module';
import { HttpErrorFilter } from './shared/http-error.filter';
import { GraphQLErrorFilter } from './shared/graphql-error.filter';

const port = process.env.PORT || 4000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpErrorFilter());
  app.useGlobalFilters(new GraphQLErrorFilter());
  app.enableCors({
    origin: [
      'http://localhost:3000', // react
    ],
  });
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
  Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
