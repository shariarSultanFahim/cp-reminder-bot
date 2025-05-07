import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(['log', 'debug', 'error', 'warn']);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
