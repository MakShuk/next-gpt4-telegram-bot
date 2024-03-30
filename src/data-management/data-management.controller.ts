import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DataManagementService } from './data-management.service';
import {
  CreateBotTokenDto,
  CreateOpenAiKeyDto,
} from './dto/create-data-management.dto';

@Controller('data-management')
export class DataManagementController {
  constructor(private readonly dataManagementService: DataManagementService) {}

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('new-bot-token')
  @HttpCode(201)
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
      await this.dataManagementService.setDevBotToken(query.botName),
    );
  }

  @Delete('delete-bot-token')
  async deleteBotToken(@Body() query: { botName: string }) {
    return this.checkError(
      await this.dataManagementService.deleteBotToken(query.botName),
    );
  }

  @Post('new-open-ai-key')
  async newOpenAiKey(@Body() query: CreateOpenAiKeyDto) {
    return this.checkError(
      await this.dataManagementService.newOpenAiKey(query),
    );
  }

  @Get('open-ai-key')
  async getOpenAiKey() {
    return this.checkError(await this.dataManagementService.getOpenAiKey());
  }

  @Delete('open-ai-key')
  @HttpCode(204)
  async deleteOpenAiKey(@Body() query: { name: string }) {
    return this.checkError(
      await this.dataManagementService.deleteOpenAiKey(query.name),
    );
  }

  @Patch('activate-open-ai-key')
  async activateOpenAiKey(@Body() query: { name: string }) {
    return this.checkError(
      await this.dataManagementService.activateOpenAiKey(query.name),
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
