import { Context } from 'telegraf';

export interface IContextSession extends Context {
  session: {
    answerStatus: 'waiting' | 'answered';
  };
}
