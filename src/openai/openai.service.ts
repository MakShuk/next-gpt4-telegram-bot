import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import fs from 'fs';

import {
  ChatCompletionChunk,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from 'openai/resources/chat';
import { ReadStream } from 'fs';
import { Stream } from 'openai/streaming';
import { DataManagementService } from 'src/data-management/data-management.service';

export interface ExtendedChatCompletionMessage extends ChatCompletionMessage {
  error?: boolean;
}

@Injectable()
export class OpenaiService {
  constructor(private readonly dataManagementService: DataManagementService) {}
  openai: OpenAI;

  async onModuleInit() {
    const openaiKey = await this.dataManagementService.getOpenAiKey();
    if (openaiKey.error) {
      throw new Error(`OpenAI key not found: ${openaiKey.message}`);
    }
    this.openai = new OpenAI({ apiKey: openaiKey.data.key });
  }

  async response(
    messages: ChatCompletionMessageParam[],
  ): Promise<ExtendedChatCompletionMessage> {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: messages,
        model: 'gpt-4-turbo-preview',
      });
      if (!completion.choices[0]?.message)
        throw new Error('openai.chat.completions is undefined');
      return completion.choices[0]?.message;
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        const { status, message, code, type } = error;
        const errorMessage = `status: ${status} message: ${message} code: ${code} type: ${type}`;
        console.error(errorMessage);
        return {
          role: 'assistant',
          content: errorMessage,
          error: true,
        };
      } else {
        return {
          role: 'assistant',
          content: `Non-API error, ${error}`,
          error: true,
        };
      }
    }
  }

  async streamResponse(
    messages: ChatCompletionMessageParam[],
  ): Promise<Stream<ChatCompletionChunk> | ExtendedChatCompletionMessage> {
    try {
      const stream = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: messages,
        stream: true,
      });
      return stream;
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        const { status, message, code, type } = error;
        const errorMessage = `status: ${status} message: ${message} code: ${code} type: ${type}`;
        console.error(errorMessage);
        return {
          role: 'assistant',
          content: errorMessage,
          error: true,
        };
      } else {
        return {
          role: 'assistant',
          content: `Non-API error, ${error}`,
          error: true,
        };
      }
    }
  }

  async imageResponse(
    messages: ChatCompletionMessageParam[],
  ): Promise<ExtendedChatCompletionMessage> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: messages,
      });
      if (!completion.choices[0]?.message)
        throw new Error('openai.chat.completions is undefined');
      return completion.choices[0]?.message;
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        const { status, message, code, type } = error;
        const errorMessage = `status: ${status} message: ${message} code: ${code} type: ${type}`;
        console.error(errorMessage);
        return {
          role: 'assistant',
          content: errorMessage,
          error: true,
        };
      } else {
        return {
          role: 'assistant',
          content: `Non-API error, ${error}`,
          error: true,
        };
      }
    }
  }

  async transcriptionAudio(
    audioStream: ReadStream,
  ): Promise<ExtendedChatCompletionMessage> {
    try {
      const response = await this.openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: audioStream,
      });
      return {
        role: 'assistant',
        content: response.text,
      };
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        const { status, message, code, type } = error;
        const errorMessage = `status: ${status} message: ${message} code: ${code} type: ${type}`;
        console.error(errorMessage);
        return {
          role: 'assistant',
          content: errorMessage,
          error: true,
        };
      } else {
        return {
          role: 'assistant',
          content: `Non-API error, ${error}`,
          error: true,
        };
      }
    }
  }

  async fileUploads(): Promise<void> {
    await this.openai.files.create({
      file: fs.createReadStream('input.json'),
      purpose: 'fine-tune',
    });
  }

  createUserMessage(message: string): ChatCompletionMessageParam {
    return {
      role: 'user',
      content: message,
    };
  }

  createAssistantMessage(message: string): ChatCompletionMessageParam {
    return {
      role: 'assistant',
      content: message,
    };
  }

  createImageUserMessage(
    message: string,
    url: string,
  ): ChatCompletionMessageParam {
    return {
      role: 'user',
      content: [
        { type: 'text', text: message },
        {
          type: 'image_url',
          image_url: {
            url: url,
          },
        },
      ],
    };
  }
}
