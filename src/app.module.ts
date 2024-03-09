import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegrafModule } from './telegraf/telegraf.module';
import { ConfigModule } from '@nestjs/config';
import { DataManagementModule } from './data-management/data-management.module';

@Module({
  imports: [TelegrafModule, ConfigModule.forRoot(), DataManagementModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
