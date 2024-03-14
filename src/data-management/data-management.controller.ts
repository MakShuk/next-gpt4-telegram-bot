import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DataManagementService } from './data-management.service';
import {
  CreateBotTokenDto,
  CreateRoleDto,
} from './dto/create-data-management.dto';

@Controller('data-management')
export class DataManagementController {
  constructor(private readonly dataManagementService: DataManagementService) {}

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('create-role')
  async createNewRole(@Body() query: CreateRoleDto) {
    return this.checkError(
      await this.dataManagementService.createNewRole(
        query.name,
        query.maxUsers,
      ),
    );
  }

  @Get('roles')
  async getAllRoles() {
    return this.checkError(await this.dataManagementService.getAllRoles());
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('set-bot-token')
  async setBotToken(@Body() query: CreateBotTokenDto) {
    return this.checkError(await this.dataManagementService.setBotToken(query));
  }

  @Get('bot-token')
  async getBotToken() {
    return this.checkError(await this.dataManagementService.getBotToken());
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
