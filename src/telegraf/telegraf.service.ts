import { Injectable } from '@nestjs/common';
import { DataManagementService } from 'src/data-management/data-management.service';
import { LoggerService } from 'src/services/logger/logger.service';
import { UsersService } from 'src/users/users.service';

import { Context, Telegraf } from 'telegraf';

@Injectable()
export class TelegrafService {
  constructor(
    private readonly logger: LoggerService,
    private readonly dataManagementService: DataManagementService,
    private readonly usersService: UsersService,
  ) {}
  private bot: Telegraf;
  private botRun: false | Date = false;

  async botInit() {
    const botToken = await this.dataManagementService.getBotToken();

    if (botToken.error && !botToken.data) {
      this.logger.error('Ошибка получения токена бота');
      return `Ошибка получения токена бота: ${botToken.message}`;
    }

    this.bot = new Telegraf(botToken.data.token);
  }

  async startBot() {
    if (this.botRun) {
      this.logger.warn('Бот уже запущен');
      return `Бот уже запущен: ${this.botRun}`;
    }

    await this.checkUserAccess();

    this.bot.launch();
    this.logger.info('Бот запущен');
    this.botRun = new Date();
    return 'Бот запущен';
  }

  creteCommand(command: string, callback: (ctx: Context) => void) {
    this.bot.command(command, callback);
  }

  private async checkUserAccess() {
    this.bot.use(async (ctx: Context, next: () => Promise<void>) => {
      const userId = ctx.from?.id;

      const { error, isUserExists, message } =
        await this.usersService.userExists(userId);
      this.logger.info(
        `Проверка доступа пользователя ${userId}, isUserExists: ${isUserExists}`,
      );
      if (error) {
        ctx.reply(message);
        return;
      }

      if (!isUserExists) {
        ctx.reply('Access denied. You are not registered in the system.');
        return;
      }
      return next();
    });
  }
}
