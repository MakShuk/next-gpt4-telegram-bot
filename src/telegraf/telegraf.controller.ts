import { Controller, Get, HttpCode } from '@nestjs/common';
import { TelegrafService } from './telegraf.service';

@Controller('telegraf')
export class TelegrafController {
  constructor(private readonly telegrafService: TelegrafService) {}

  @Get('start')
  @HttpCode(200)
  async startBot() {
    return await this.telegrafService.startBot();
  }
}
