import { Injectable } from '@nestjs/common';
import { IBotContext } from './commands.interface';

@Injectable()
export class Commands {
  start = (ctx: IBotContext) => {
    ctx.session = ctx.session || { time: 0, message: [] };
    ctx.reply(
      '🤖 Привет! Я здесь, чтобы помочь вам. Задайте мне любой вопрос, и я постараюсь на него ответить. Давайте начнем!',
    );
  };
}
