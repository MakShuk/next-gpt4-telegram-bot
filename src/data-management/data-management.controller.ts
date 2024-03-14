import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DataManagementService } from './data-management.service';
import { CreateBotTokenDto } from './dto/create-data-management.dto';

@Controller('data-management')
export class DataManagementController {
  constructor(private readonly dataManagementService: DataManagementService) {}

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('new-bot-token')
  async newBotToken(@Body() query: CreateBotTokenDto) {
    return this.checkError(await this.dataManagementService.newBotToken(query));
  }

  @Get('bot-token')
  async getBotToken() {
    return this.checkError(await this.dataManagementService.getBotToken());
  }

  @Patch('activate-bot-token')
  async activateBotToken(@Body() query: { botName: string }) {
    return this.checkError(
      await this.dataManagementService.activateBotToken(query.botName),
    );
  }

  @Delete('delete-bot-token')
  async deleteBotToken(@Body() query: { botName: string }) {
    return this.checkError(
      await this.dataManagementService.deleteBotToken(query.botName),
    );
  }

  private checkError(resultStatus: { error: boolean; message: string }) {
    if (resultStatus.error) {
      throw new HttpException(
        `${resultStatus.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return resultStatus;
  }
}
