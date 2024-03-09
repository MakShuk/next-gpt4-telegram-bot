import { Controller, Get, Post } from '@nestjs/common';
import { DataManagementService } from './data-management.service';

@Controller('data-management')
export class DataManagementController {
  constructor(private readonly dataManagementService: DataManagementService) {}

  @Get('users')
  findAllUsers() {
    return this.dataManagementService.getUsers();
  }

  @Post('create-user')
  createNewUser() {
    return this.dataManagementService.createNewRole();
  }

  @Get('roles')
  getAllRoles() {
    return this.dataManagementService.getAllRoles();
  }
}
