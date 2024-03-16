import { Module } from '@nestjs/common';
import { DataManagementService } from './data-management.service';
import { DataManagementController } from './data-management.controller';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [DataManagementController],
  providers: [DataManagementService, PrismaService],
  exports: [DataManagementService, PrismaService],
})
export class DataManagementModule {}
