import { Controller, Get, Res } from '@nestjs/common';
import { OpenaiService, ExtendedChatCompletionMessage } from './openai.service';
import fs, { ReadStream } from 'fs';
import { Stream } from 'openai/streaming';
import { Response } from 'express';
import {
  ChatCompletionChunk,
  ChatCompletionMessageParam,
} from 'openai/resources/chat';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Get('response')
  async response(): Promise<ExtendedChatCompletionMessage> {
    const messages: ChatCompletionMessageParam[] = [];
    messages.push(this.openaiService.createUserMessage('1 афоризм'));
    const response = await this.openaiService.response(messages);
    if (response.error) console.log('Ошибка');
    return response;
  }

  @Get('stream-response')
  async streamResponse(
    @Res() res: Response,
  ): Promise<Stream<ChatCompletionChunk> | string> {
    const message = this.openaiService.createUserMessage(
      'Расскажи подробно он докер compose',
    );
    const yourStream = await this.openaiService.streamResponse([message]);
    if (yourStream instanceof Stream) {
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', 'attachment; filename=stream.txt');
      for await (const part of yourStream) {
        process.stdout.write(part.choices[0]?.delta?.content || '');
      }
      return yourStream;
    } else {
      return yourStream.content || 'Нет данных';
    }
  }

  @Get('image-response')
  async imageResponse() {
    const messages = this.openaiService.createImageUserMessage(
      'Что на картинке?',
      'https://docs.nestjs.com/assets/Controllers_1.png',
    );
    return await this.openaiService.imageResponse([messages]);
  }

  @Get('file-uploads')
  fileUploads(): Promise<void> {
    return this.openaiService.fileUploads();
  }

  @Get('transcription-audio')
  transcriptionAudio(): Promise<ExtendedChatCompletionMessage> {
    const stream: ReadStream = fs.createReadStream('audio.mp3');
    return this.openaiService.transcriptionAudio(stream);
  }
}
