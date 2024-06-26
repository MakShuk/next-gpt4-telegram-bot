import { Injectable } from '@nestjs/common';
import { TelegrafService } from './telegraf/telegraf.service';
import { OnModuleInit } from '@nestjs/common';
import { OpenaiService } from './openai/openai.service';
import { CommandsService } from './services/commands/commands';

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

  async startBot(): Promise<void> {
    try {
      await this.openAiService.onModuleInit();
      await this.telegrafService.botInit();
      this.telegrafService.createCommand('start', this.command.start);
      this.telegrafService.createCommand('reset', this.command.reset);
      this.telegrafService.voiceMessage(this.command.voiceMessage);
      this.telegrafService.textMessage(this.command.text);
      this.telegrafService.repostMessage(this.command.repostAndImage);
      this.telegrafService.imageMessage();
      await this.telegrafService.startBot();
    } catch (error) {
      console.error('Error starting bot:', error);
    }
  }
}
