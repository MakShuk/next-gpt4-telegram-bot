import { Injectable } from '@nestjs/common';
import { TelegrafService } from './telegraf/telegraf.service';
import { OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
  onModuleInit() {
    this.startBot();
  }
  constructor(private telegrafService: TelegrafService) {}
  async startBot(): Promise<string> {
    await this.telegrafService.startBot();
    return 'Bot started';
  }
}
