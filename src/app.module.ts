import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegrafModule } from './telegraf/telegraf.module';

@Module({
  imports: [TelegrafModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
