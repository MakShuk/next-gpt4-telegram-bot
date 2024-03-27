import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegrafModule } from './telegraf/telegraf.module';
import { ConfigModule } from '@nestjs/config';
import { DataManagementModule } from './data-management/data-management.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { TelegrafService } from './telegraf/telegraf.service';
import { LoggerService } from './services/logger/logger.service';
import { OpenaiModule } from './openai/openai.module';
import { OpenaiService } from './openai/openai.service';
import { CommandsService } from './commands/commands';

@Module({
  imports: [
    TelegrafModule,
    ConfigModule.forRoot(),
    DataManagementModule,
    UsersModule,
    AuthModule,
    OpenaiModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: LoggerService,
      useValue: new LoggerService('APP'),
    },
    AppService,
    TelegrafService,
    OpenaiService,
    CommandsService,
  ],
})
export class AppModule {}
