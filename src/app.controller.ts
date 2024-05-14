import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async startBot(): Promise<void> {
    try {
      await this.appService.startBot();
    } catch (error) {
      console.error('Ошибка при запуске бота:', error);
      throw error;
    }
  }
}
