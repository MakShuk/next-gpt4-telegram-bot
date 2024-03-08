import { Controller, Get } from '@nestjs/common';
import { TelegrafService } from './telegraf.service';

@Controller('telegraf')
export class TelegrafController {
  constructor(private readonly telegrafService: TelegrafService) {}

  @Get('start')
  startBot() {
    return this.telegrafService.startBot();
  }
}
