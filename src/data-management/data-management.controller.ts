import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DataManagementService } from './data-management.service';
import { CreateRoleDto } from './dto/create-data-management.dto';

@Controller('data-management')
export class DataManagementController {
  constructor(private readonly dataManagementService: DataManagementService) {}

  @Get('users')
  findAllUsers() {
    return this.dataManagementService.getUsers();
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('create-role')
  createNewRole(@Body() query: CreateRoleDto) {
    return this.dataManagementService.createNewRole(query.name, query.maxUsers);
  }

  @Get('roles')
  getAllRoles() {
    return this.dataManagementService.getAllRoles();
  }
}
