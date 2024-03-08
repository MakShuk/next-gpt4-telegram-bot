import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(2999);
  console.log('Бот запущен на порту 2999');
}
bootstrap();
