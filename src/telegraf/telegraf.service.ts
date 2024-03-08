import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/services/logger/logger.service';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegrafService {
  constructor(private readonly logger: LoggerService) {}
  private bot = new Telegraf('1888646294:AAGLcttVtKEEdVXFTFDuGtRy5FGQbdOKFfQ');
  private botRun: false | Date = false;
  startBot() {
    if (this.botRun) {
      this.logger.warn('Бот уже запущен');
      return `Бот уже запущен: ${this.botRun}`;
    }
    this.bot.launch();
    this.logger.info('Бот запущен');
    this.botRun = new Date();
    return 'Бот запущен';
  }
}
