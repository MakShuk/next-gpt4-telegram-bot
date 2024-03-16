import { Module } from '@nestjs/common';
import { TelegrafService } from './telegraf.service';
import { TelegrafController } from './telegraf.controller';
import { LoggerService } from 'src/services/logger/logger.service';
import { DataManagementModule } from 'src/data-management/data-management.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [DataManagementModule],
  controllers: [TelegrafController],
  providers: [
    TelegrafService,
    UsersService,
    {
      provide: LoggerService,
      useValue: new LoggerService('telegraf'),
    },
  ],
})
export class TelegrafModule {}
