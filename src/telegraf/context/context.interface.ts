import { ChatCompletionMessageParam } from 'openai/resources';
import { Context } from 'telegraf';

export interface SessionData {
  time: number;
  message: ChatCompletionMessageParam[];
}

export interface IBotContext extends Context {
  session?: SessionData;
}
