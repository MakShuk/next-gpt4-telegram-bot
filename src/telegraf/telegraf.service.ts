import { Injectable } from '@nestjs/common';
import { DataManagementService } from 'src/data-management/data-management.service';
import { LoggerService } from 'src/services/logger/logger.service';
import { Context, Telegraf } from 'telegraf';

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

    this.bot.use((ctx: Context, next: () => Promise<void>) => {
      const userId = ctx.from?.id;
      console.log(userId);
      if (userId !== 123456) {
        // Если ID пользователя не проходит проверку, вы можете прервать выполнение
        // или отправить пользователю сообщение об ошибке
        ctx.reply('Access denied.');
        return;
      }

      // Если ID пользователя проходит проверку, продолжаем выполнение следующего middleware
      return next();
    });

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
