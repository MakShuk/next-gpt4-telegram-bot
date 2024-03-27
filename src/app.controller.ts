import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async startBot(): Promise<string> {
    try {
      return await this.appService.startBot();
    } catch (error) {
      console.error('Ошибка при запуске бота:', error);
      throw error;
    }
  }
}
