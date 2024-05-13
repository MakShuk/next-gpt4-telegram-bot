import { Injectable } from '@nestjs/common';
import { IBotContext } from './commands.interface';
import { OpenaiService } from 'src/openai/openai.service';
import { Stream } from 'openai/streaming';
import { Context } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import * as fs from 'fs';
import { OggConverter } from '../converter/ogg-converter.service';
import axios from 'axios';
import * as path from 'path';

@Injectable()
export class CommandsService {
  constructor(
    private openAiService: OpenaiService,
    private oggConverter: OggConverter,
  ) {}

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

      if (!('text' in ctx.message)) return;
      await this.streamMessage(ctx, ctx.message.text);
    } catch (error) {
      this.handleError(error, ctx);
    }
  };

  repostAndImage = async (ctx: IBotContext) => {
    try {
      this.initializeSession(ctx);
      if ('caption' in ctx.message && !('photo' in ctx.message)) {
        this.processCaption(ctx);
      }

      if ('photo' in ctx.message) {
        if (!ctx.message.caption) {
          ctx.message.caption = 'Что на картинке?';
        }

        await this.processPhoto(ctx);
      }
    } catch (error) {
      this.handleError(error, ctx);
    }
  };

  voiceMessage = async (ctx: IBotContext) => {
    if (!('voice' in ctx.message)) return;
    try {
      this.initializeSession(ctx);
      const fileId = ctx.message.voice?.file_id;
      const fileLink = await ctx.telegram.getFileLink(fileId);
      const userId = ctx.from.id;

      const response = await axios({
        method: 'get',
        url: String(fileLink),
        responseType: 'stream',
      });

      const dir = './audios';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      const writer = fs.createWriteStream(`./audios/${userId}.ogg`);

      await new Promise((resolve, reject) => {
        response.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      await this.covertToMp3(String(userId));

      const readStream = fs.createReadStream(`./audios/${userId}.mp3`);

      const transcription =
        await this.openAiService.transcriptionAudio(readStream);
      await this.streamMessage(ctx, transcription.content);
    } catch (error) {
      console.error(error);
      await ctx.reply(
        '⚠️ Произошла ошибка при обработке голосового сообщения.',
      );
    }
  };

  private async streamMessage(ctx: IBotContext, message: string) {
    try {
      const sendMessage = await ctx.reply(
        '🔄 Подождите, идет обработка запроса...',
      );
      console.log('streamMessage -> message', message);
      const userMessage = this.openAiService.createUserMessage(message);
      ctx.session.message.push(userMessage);
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
    } catch (error) {
      console.error(error);
      this.handleError(error, ctx);
    }
  }

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

  private async covertToMp3(userId?: string) {
    const inputFile = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'audios',
      `${userId}.ogg`,
    );
    const outputFile = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'audios',
      `${userId}.mp3`,
    );
    const converter = await this.oggConverter.convertToMp3(
      inputFile,
      outputFile,
    );

    await this.oggConverter.deleteFile(inputFile);
    return converter;
  }

  private checkTime = (context: IBotContext): boolean =>
    context.message.date >= context.session.time
      ? ((context.session.time = context.message.date + 6), true)
      : false;
}
