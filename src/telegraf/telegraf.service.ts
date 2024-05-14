import { Injectable } from '@nestjs/common';
import { DataManagementService } from 'src/data-management/data-management.service';
import { LoggerService } from 'src/services/logger/logger.service';
import { UsersService } from 'src/users/users.service';
import { message } from 'telegraf/filters';
import { Telegraf, session } from 'telegraf';
import { Context } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class TelegrafService {
  constructor(
    private readonly logger: LoggerService,
    private readonly dataManagementService: DataManagementService,
    private readonly usersService: UsersService,
  ) {}
  private bot: Telegraf | undefined;
  private botRun: false | Date = false;

  async botInit() {
    const botToken = await this.dataManagementService.getBotToken();

    if (botToken.error && !botToken.data) {
      this.logger.error('Ошибка получения токена бота');
      return `Ошибка получения токена бота: ${botToken.message}`;
    }

    if (!botToken.data) return;
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
    if (!this.bot) return;
    this.bot.launch();
    this.logger.info(
      `Бот запущен ${process.env.DEV_MODE === 'true' ? 'в режиме разработки' : ''}`,
    );
    this.botRun = new Date();
    return 'Бот запущен';
  }

  createCommand(command: string, callback: (ctx: Context) => void) {
    if (!this.bot) return;
    this.bot.command(command, callback);
  }

  textMessage(callback: (ctx: Context) => void) {
    if (!this.bot) return;
    this.bot.on(message('text'), callback);
  }

  repostMessage(callback: (ctx: Context) => void) {
    if (!this.bot) return;
    this.bot.on('message', callback);
  }

  imageMessage() {
    if (!this.bot) return;
    this.bot.on('photo', (ctx: Context) => {
      if (!this.bot) return;
      console.log('photo');
      console.log(ctx.message);
      ctx.reply('🚧 В разработке');
    });
  }

  async voiceMessage(callback: (ctx: Context) => void) {
    if (!this.bot) return;
    this.bot.on(message('voice'), callback);
  }

  private async checkUserAccess() {
    if (!this.bot) return;
    this.bot.use(async (ctx: Context, next: () => Promise<void>) => {
      if (!ctx.from) return;
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

  async editMessageText(
    ctx: Context,
    oldMessage: Message.TextMessage,
    newMessage: string,
    markdown = false,
  ) {
    if (newMessage.trim() === '') return;
    await ctx.telegram.editMessageText(
      oldMessage.chat.id,
      oldMessage.message_id,
      undefined,
      newMessage,
      {
        parse_mode: markdown ? 'Markdown' : undefined,
      },
    );
  }
}
