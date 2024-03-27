import { Injectable } from '@nestjs/common';
import { IBotContext } from './commands.interface';
import { OpenaiService } from 'src/openai/openai.service';

@Injectable()
export class CommandsService {
  constructor(private openAiService: OpenaiService) {}

  start = (ctx: IBotContext) => {
    this.initializeSession(ctx);
    ctx.reply(
      '🤖 Привет! Я здесь, чтобы помочь вам. Задайте мне любой вопрос, и я постараюсь на него ответить. Давайте начнем!',
    );
  };

  reset = (ctx: IBotContext) => {
    this.initializeSession(ctx);
    ctx.session.message = [];
    ctx.reply('⤵️ Контекст сброшен, диалог начат заново');
  };

  textMessage = async (ctx: IBotContext) => {
    try {
      this.initializeSession(ctx);
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
      this.handleError(error, ctx);
    }
  };

  repostMessage = async (ctx: IBotContext) => {
    try {
      this.initializeSession(ctx);
      console.log('repostMessage', ctx.session.message);
      if ('caption' in ctx.message) {
        ctx.session.message.push(
          this.openAiService.createAssistantMessage(ctx.message.caption),
        );
        ctx.reply('❓Задайте вопрос, по этому материалу');
      }
    } catch (error) {
      this.handleError(error, ctx);
    }
  };

  private initializeSession = (ctx: IBotContext) => {
    ctx.session = ctx.session || { time: 0, message: [] };
  };

  private handleError = async (error: any, ctx: IBotContext) => {
    console.error(error);
    await ctx.reply('⚠️ Произошла ошибка. Попробуйте еще раз.');
  };

  private checkTime = (context: IBotContext): boolean =>
    context.message.date >= context.session.time
      ? ((context.session.time = context.message.date + 6), true)
      : false;
}
