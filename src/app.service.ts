import { Injectable } from '@nestjs/common';
import { TelegrafService } from './telegraf/telegraf.service';
import { OnModuleInit } from '@nestjs/common';
import { OpenaiService } from './openai/openai.service';
import { CommandsService } from './commands/commands';

@Injectable()
export class AppService implements OnModuleInit {
  onModuleInit() {
    this.startBot();
  }
  constructor(
    private telegrafService: TelegrafService,
    private openAiService: OpenaiService,
    private command: CommandsService,
  ) {}

  async startBot(): Promise<string> {
    try {
      await this.openAiService.onModuleInit();
      await this.telegrafService.botInit();
      this.telegrafService.creteCommand('start', this.command.start);
      this.telegrafService.creteCommand('reset', this.command.reset);
      this.telegrafService.textMessage(this.command.textMessage);
      this.telegrafService.repostMessage(this.command.repostMessage);
      await this.telegrafService.startBot();
      return 'Bot started';
    } catch (error) {
      console.error('Error starting bot:', error);
    }
  }
}
