import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';
import { DataManagementModule } from 'src/data-management/data-management.module';

@Module({
  imports: [DataManagementModule],
  providers: [OpenaiService],
  controllers: [OpenaiController],
  exports: [OpenaiService],
})
export class OpenaiModule {}
