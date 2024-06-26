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
import { APIError } from 'openai/error';

export interface ExtendedChatCompletionMessage extends ChatCompletionMessage {
  error?: boolean;
}

@Injectable()
export class OpenaiService {
  constructor(private readonly dataManagementService: DataManagementService) {}
  openai: OpenAI | undefined;

  async onModuleInit() {
    const openaiKey = await this.dataManagementService.getOpenAiKey();
    if (openaiKey.error) {
      throw new Error(`OpenAI key not found: ${openaiKey.message}`);
    }
    if (!openaiKey.data) {
      throw new Error('OpenAI key not found');
    }
    this.openai = new OpenAI({ apiKey: openaiKey.data.key });
  }

  async response(
    messages: ChatCompletionMessageParam[],
  ): Promise<ExtendedChatCompletionMessage> {
    try {
      if (!this.openai) throw new Error('OpenAI not initialized');
      const completion = await this.openai.chat.completions.create({
        messages: messages,
        model: 'gpt-4o-2024-05-13',
      });
      if (!completion.choices[0]?.message)
        throw new Error('openai.chat.completions is undefined');
      return completion.choices[0]?.message;
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  async streamResponse(
    messages: ChatCompletionMessageParam[],
  ): Promise<Stream<ChatCompletionChunk> | ExtendedChatCompletionMessage> {
    try {
      if (!this.openai) throw new Error('OpenAI not initialized');
      const stream = await this.openai.chat.completions.create({
        model: 'gpt-4o-2024-05-13',
        messages: messages,
        stream: true,
      });
      return stream;
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  async imageResponse(messages: ChatCompletionMessageParam[]) {
    try {
      if (!this.openai) throw new Error('OpenAI not initialized');
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-2024-05-13',
        messages: messages,
      });
      if (!completion.choices[0]?.message)
        throw new Error('openai.chat.completions is undefined');
      return {
        content: completion.choices[0]?.message,
        error: false,
        role: 'assistant',
      };
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  async transcriptionAudio(
    audioStream: ReadStream,
  ): Promise<ExtendedChatCompletionMessage> {
    if (!this.openai) {
      throw new Error('OpenAI not initialized');
    }

    try {
      const response = await this.openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: audioStream,
      });

      return {
        role: 'assistant',
        content: response.text,
      };
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  async fileUploads(): Promise<void> {
    if (!this.openai) throw new Error('OpenAI not initialized');
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

  private handleError(error: unknown): ExtendedChatCompletionMessage {
    if (this.isAPIError(error)) {
      const { status, message, code, type } = error;
      const errorMessage = `status: ${status} message: ${message} code: ${code} type: ${type}`;
      console.error(errorMessage);

      return {
        role: 'assistant',
        content: errorMessage,
        error: true,
      };
    } else {
      const errorMessage = `Non-API error: ${error}`;
      console.error(errorMessage);

      return {
        role: 'assistant',
        content: errorMessage,
        error: true,
      };
    }
  }

  private isAPIError(error: unknown): error is APIError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      'code' in error &&
      'type' in error
    );
  }
}
