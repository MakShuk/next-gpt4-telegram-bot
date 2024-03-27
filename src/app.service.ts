import { Injectable } from '@nestjs/common';
import { TelegrafService } from './telegraf/telegraf.service';
import { OnModuleInit } from '@nestjs/common';
import { OpenaiService } from './openai/openai.service';
import { IBotContext } from './commands/commands.interface';
import { Commands } from './commands/commands';

@Injectable()
export class AppService implements OnModuleInit {
  onModuleInit() {
    this.startBot();
  }
  constructor(
    private telegrafService: TelegrafService,
    private openAiService: OpenaiService,
    private command: Commands,
  ) {}

  async startBot(): Promise<string> {
    console.log(this.command);
    try {
      await this.openAiService.onModuleInit();
      await this.telegrafService.botInit();
      this.telegrafService.creteCommand('start', this.command.start);
      this.telegrafService.creteCommand('reset', this.resetCommand);
      this.telegrafService.textMessage(this.textMessage);
      this.telegrafService.repostMessage(this.repostMessage);
      await this.telegrafService.startBot();
      return 'Bot started';
    } catch (error) {
      console.error('Error starting bot:', error);
    }
  }

  private startCommand = (ctx: IBotContext) => {
    ctx.session = ctx.session || { time: 0, message: [] };
    ctx.reply(
      '🤖 Привет! Я здесь, чтобы помочь вам. Задайте мне любой вопрос, и я постараюсь на него ответить. Давайте начнем!',
    );
  };

  private resetCommand = (ctx: IBotContext) => {
    ctx.session = ctx.session || { time: 0, message: [] };
    ctx.session.message = [];
    ctx.reply('⤵️ Контекст сброшен, диалог начат заново');
  };

  private textMessage = async (ctx: IBotContext) => {
    try {
      ctx.session = ctx.session || { time: 0, message: [] };
      console.log('textMessage', ctx.session.message);

      if (!this.checkTime(ctx)) {
        await ctx.reply('🚧 Не успеваю за вами...');
        return;
      }
      if ('text' in ctx.message) {
        const message = this.openAiService.createUserMessage(ctx.message.text);
        ctx.session.message.push(message);
        ctx.reply('🔄 Подождите, идет обработка запроса...');
        const response = await this.openAiService.response(ctx.session.message);

        ctx.reply(response.content, {
          parse_mode: 'Markdown',
        });
        ctx.session.message.push(
          this.openAiService.createAssistantMessage(response.content),
        );
      }
    } catch (error) {
      console.error(error);
      await ctx.reply('⚠️ Произошла ошибка. Попробуйте еще раз.');
    }
  };

  private repostMessage = async (ctx: IBotContext) => {
    try {
      ctx.session = ctx.session || { time: 0, message: [] };
      console.log('repostMessage', ctx.session.message);
      if ('caption' in ctx.message) {
        ctx.session.message.push(
          this.openAiService.createAssistantMessage(ctx.message.caption),
        );
        ctx.reply('❓Задайте вопрос, по этому материалу');
      }
    } catch (error) {
      console.error(error);
    }
  };

  private checkTime = (context: IBotContext): boolean =>
    context.message.date >= context.session.time
      ? ((context.session.time = context.message.date + 6), true)
      : false;
}
