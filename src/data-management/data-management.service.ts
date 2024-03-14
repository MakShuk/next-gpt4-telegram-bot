import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreateBotTokenDto } from './dto/create-data-management.dto';

@Injectable()
export class DataManagementService {
  constructor(private prisma: PrismaService) {}
  async getUsers() {
    try {
      const allUsers = await this.prisma.user.findMany();
      return { error: false, data: allUsers, message: 'Users found' };
    } catch (error) {
      return { error: true, message: `getUsers error: ${error}` };
    }
  }

  createNewUser() {
    return null;
  }

  async createNewRole(name: string, maxUsers: number) {
    try {
      const newRole = await this.prisma.role.create({
        data: {
          name,
          maxUsers,
        },
      });
      console.log(newRole);
      return {
        error: false,
        data: newRole,
        message: 'Role created successfully',
      };
    } catch (error) {
      console.log(error);
      return { error: true, message: `createNewRole error: ${error}` };
    }
  }

  async getAllRoles() {
    try {
      const roles = await this.prisma.role.findMany();
      return { error: false, data: roles, message: 'Roles found' };
    } catch (error) {
      return { error: true, message: `getAllRoles error: ${error}` };
    }
  }

  async setBotToken(data: CreateBotTokenDto) {
    try {
      const botToken = await this.prisma.botToken.create({
        data,
      });
      return {
        error: false,
        message: `Bot token set successfully, ${botToken.botName} - ${botToken.token}`,
      };
    } catch (error) {
      return { error: true, message: `setBotToken error: ${error}` };
    }
  }

  async getBotToken() {
    try {
      const activeBotToken = await this.prisma.botToken.findFirst({
        where: {
          isActivated: true,
        },
      });
      return { error: false, data: activeBotToken, message: 'Bot token found' };
    } catch (error) {
      return { error: true, message: `getBotToken error: ${error}` };
    }
  }
}
