import { Injectable } from '@nestjs/common';
import { TelegrafService } from './telegraf/telegraf.service';
import { OnModuleInit } from '@nestjs/common';
import { OpenaiService } from './openai/openai.service';
import { Context } from 'telegraf';

@Injectable()
export class AppService implements OnModuleInit {
  onModuleInit() {
    this.startBot();
  }
  constructor(
    private telegrafService: TelegrafService,
    private openAiService: OpenaiService,
  ) {}
  async startBot(): Promise<string> {
    await this.openAiService.onModuleInit();
    await this.telegrafService.botInit();
    this.telegrafService.creteCommand('start', this.startCommands);
    await this.telegrafService.startBot();
    return 'Bot started';
  }

  private startCommands(ctx: Context) {
    ctx.reply('Hello');
  }
}
