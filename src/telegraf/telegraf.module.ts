import { Module } from '@nestjs/common';
import { TelegrafService } from './telegraf.service';
import { TelegrafController } from './telegraf.controller';
import { LoggerService } from 'src/services/logger/logger.service';

@Module({
  controllers: [TelegrafController],
  providers: [
    TelegrafService,
    {
      provide: LoggerService,
      useValue: new LoggerService('telegraf'),
    },
  ],
})
export class TelegrafModule {}
