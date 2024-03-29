import { Injectable } from '@nestjs/common';
import { DataManagementService } from 'src/data-management/data-management.service';
import { LoggerService } from 'src/services/logger/logger.service';
import { UsersService } from 'src/users/users.service';
import { message } from 'telegraf/filters';
import { Telegraf, session } from 'telegraf';
import { Context } from 'telegraf';

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
    this.bot.use(session());
    this.bot.catch((err: any, ctx: Context) => {
      console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
    });
    await this.checkUserAccess();
  }

  async startBot() {
    if (this.botRun) {
      this.logger.warn('Бот уже запущен');
      return `Бот уже запущен: ${this.botRun}`;
    }

    this.bot.launch();
    this.logger.info('Бот запущен');
    this.botRun = new Date();
    return 'Бот запущен';
  }

  createCommand(command: string, callback: (ctx: Context) => void) {
    this.bot.command(command, callback);
  }

  textMessage(callback: (ctx: Context) => void) {
    this.bot.on(message('text'), callback);
  }

  repostMessage(callback: (ctx: Context) => void) {
    this.bot.on('message', callback);
  }

  imageMessage() {
    this.bot.on('photo', (ctx: Context) => {
      console.log('photo');
      console.log(ctx.message);
      ctx.reply('🚧 В разработке');
    });
  }

  private async checkUserAccess() {
    this.bot.use(async (ctx: Context, next: () => Promise<void>) => {
      //  console.log(ctx);
      const userId = ctx.from.id;
      const {
        error,
        data: UserData,
        message,
      } = await this.usersService.userExists(userId);
      this.logger.info(
        `Проверка доступа пользователя ${userId} ${UserData ? UserData.name + ' прошла успешно' : 'доступ запрещен'}`,
      );
      if (error) {
        ctx.reply(message);
        return;
      }

      if (!UserData) {
        ctx.reply(
          `Access denied. You are not registered in the system. Contact the administrator to provide this number: ${userId}`,
        );
        return;
      }
      return next();
    });
  }
}
