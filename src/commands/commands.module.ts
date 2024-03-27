import { Module } from '@nestjs/common';
import { OpenaiModule } from 'src/openai/openai.module';
import { LoggerService } from 'src/services/logger/logger.service';
import { CommandsService } from './commands';
import { OpenaiService } from 'src/openai/openai.service';

@Module({
  imports: [OpenaiModule],
  controllers: [],
  providers: [
    {
      provide: LoggerService,
      useValue: new LoggerService('commands'),
    },

    CommandsService,
    OpenaiService,
  ],
})
export class AppModule {}
