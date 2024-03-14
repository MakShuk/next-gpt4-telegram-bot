import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreateBotTokenDto } from './dto/create-data-management.dto';

@Injectable()
export class DataManagementService {
  constructor(private prisma: PrismaService) {}
  async getUsers() {
    const allUsers = await this.prisma.user.findMany();
    return allUsers;
  }

  createNewUser() {
    return null;
  }

  async createNewRole(name: string, maxUsers: number) {
    const newRole = await this.prisma.role.create({
      data: {
        name,
        maxUsers,
      },
    });
    console.log(newRole);
  }

  getAllRoles() {
    return this.prisma.role.findMany();
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
