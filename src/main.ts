import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT || 2999;
    await app.listen(port);
    console.log(`Бот запущен на порту ${port}`);
  } catch (error) {
    console.error('Ошибка при запуске приложения:', error);
  }
}

bootstrap();
