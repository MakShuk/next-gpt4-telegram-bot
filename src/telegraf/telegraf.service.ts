import { Injectable } from '@nestjs/common';
import { DataManagementService } from 'src/data-management/data-management.service';
import { LoggerService } from 'src/services/logger/logger.service';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegrafService {
  constructor(
    private readonly logger: LoggerService,
    private readonly dataManagementService: DataManagementService,
  ) {}
  private bot: Telegraf;
  private botRun: false | Date = false;

  async startBot() {
    const botToken = await this.dataManagementService.getBotToken(); // Получаем токен бота

    if (botToken.error && !botToken.data) {
      this.logger.error('Ошибка получения токена бота');
      return `Ошибка получения токена бота: ${botToken.message}`;
    }

    this.bot = new Telegraf(botToken.data.token); // Создаем экземпляр бота

    if (this.botRun) {
      this.logger.warn('Бот уже запущен');
      return `Бот уже запущен: ${this.botRun}`;
    }

    this.bot.command('t', (ctx) => {
      console.log(ctx.message.from);
      ctx.reply('Hello');
    });

    this.bot.launch();
    this.logger.info('Бот запущен');
    this.botRun = new Date();
    return 'Бот запущен';
  }
}
