import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DataManagementService } from './data-management.service';

@Controller('data-management')
export class DataManagementController {
  constructor(private readonly dataManagementService: DataManagementService) {}

  @Get('users')
  findAllUsers() {
    return this.dataManagementService.getUsers();
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('create-role')
  createNewRole(@Body() query: CreateTagDto) {
    return this.dataManagementService.createNewRole();
  }

  @Get('roles')
  getAllRoles() {
    return this.dataManagementService.getAllRoles();
  }
}
