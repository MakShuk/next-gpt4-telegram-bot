import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (e) {
      throw new Error(
        `Ошибка подключения к базе данных, отсутствует файл конфигурации. Детали ошибки: ${(e as Error).message}`,
      );
    }
  }
}
