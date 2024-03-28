import { Module } from '@nestjs/common';
import { TelegrafService } from './telegraf.service';
import { TelegrafController } from './telegraf.controller';
import { LoggerService } from 'src/services/logger/logger.service';
import { DataManagementModule } from 'src/data-management/data-management.module';
import { UsersService } from 'src/users/users.service';

const loggerServiceProvider = {
  provide: LoggerService,
  useValue: new LoggerService('telegraf'),
};

@Module({
  imports: [DataManagementModule],
  controllers: [TelegrafController],
  providers: [TelegrafService, UsersService, loggerServiceProvider],
  exports: [TelegrafService],
})
export class TelegrafModule {}
