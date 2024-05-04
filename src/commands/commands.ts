import { Injectable } from '@nestjs/common';
import { IBotContext } from './commands.interface';
import { OpenaiService } from 'src/openai/openai.service';
import { Stream } from 'openai/streaming';
import { Context } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';

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

  text = async (ctx: IBotContext) => {
    try {
      this.initializeSession(ctx);
      if (!this.checkTime(ctx)) {
        await ctx.reply('🚧 Не успеваю за вами...');
        return;
      }
      if ('text' in ctx.message) {
        const sendMessage = await ctx.reply(
          '🔄 Подождите, идет обработка запроса...',
        );
        const message = this.openAiService.createUserMessage(ctx.message.text);
        ctx.session.message.push(message);

        //  console.log('text -> ctx.session.message', ctx.session.message);
        const streamResponse = await this.openAiService.streamResponse(
          ctx.session.message,
        );

        if ('error' in streamResponse) {
          ctx.reply(streamResponse.content);
          return;
        }

        let messageContent = '';

        if (streamResponse instanceof Stream) {
          let lastCallTime = Date.now();
          for await (const part of streamResponse) {
            const currentTime = Date.now();
            messageContent += part.choices[0]?.delta?.content || '';
            if (currentTime - lastCallTime > 1000) {
              lastCallTime = currentTime;
              await this.editMessageText(ctx, sendMessage, messageContent);
            }
          }

          await this.editMessageText(ctx, sendMessage, messageContent, true);

          ctx.session.message.push(
            this.openAiService.createAssistantMessage(messageContent),
          );
        }
      }
    } catch (error) {
      this.handleError(error, ctx);
    }
  };

  repostAndImage = async (ctx: IBotContext) => {
    try {
      this.initializeSession(ctx);
      if ('caption' in ctx.message && !('photo' in ctx.message)) {
        // console.log('Действие при наличии Caption');
        this.processCaption(ctx);
      }

      if ('photo' in ctx.message) {
        //  console.log('Распознавание фото');
        if (!ctx.message.caption) {
          ctx.message.caption = 'Что на картинке?';
        }

        await this.processPhoto(ctx);
      }
    } catch (error) {
      this.handleError(error, ctx);
    }
  };

  private processCaption = (ctx: IBotContext) => {
    if (!('caption' in ctx.message)) return;
    ctx.session.message.push(
      this.openAiService.createAssistantMessage(ctx.message.caption),
    );
    ctx.reply('❓Задайте вопрос, по этому материалу');
  };

  private processPhoto = async (ctx: IBotContext) => {
    if (!('caption' in ctx.message)) return;
    if (!('photo' in ctx.message)) return;
    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    const photoUrl = await ctx.telegram.getFileLink(photo.file_id);
    const message = this.openAiService.createImageUserMessage(
      `${ctx.message.caption || 'Что на картинке?'}`,
      photoUrl.href,
    );
    //console.log('processPhoto -> message', message);
    ctx.reply('🔄 Подождите, идет обработка фото...');
    const response = await this.openAiService.imageResponse([message]);

    if (response.error) {
      ctx.reply(response.content);
      throw new Error(response.content);
    }

    ctx.session.message.push(
      this.openAiService.createAssistantMessage(response.content),
    );
    ctx.reply(response.content);
  };

  private initializeSession = (ctx: IBotContext) => {
    ctx.session = ctx.session || { time: 0, message: [] };
  };

  private handleError = async (error: any, ctx: IBotContext) => {
    console.error(error);
    await ctx.reply('⚠️ Произошла ошибка. Попробуйте еще раз.');
  };

  private async editMessageText(
    ctx: Context,
    oldMessage: Message.TextMessage,
    newMessage: string,
    markdown = false,
  ) {
    if (newMessage.trim() === '') return;
    await ctx.telegram.editMessageText(
      oldMessage.chat.id,
      oldMessage.message_id,
      null,
      newMessage,
      {
        parse_mode: markdown ? 'Markdown' : undefined,
      },
    );
  }

  private checkTime = (context: IBotContext): boolean =>
    context.message.date >= context.session.time
      ? ((context.session.time = context.message.date + 6), true)
      : false;
}
