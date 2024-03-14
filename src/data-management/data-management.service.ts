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
    const botToken = await this.prisma.botToken.create({
      data,
    });
    console.log(botToken);
  }

  async getBotToken() {
    const activeBotToken = await this.prisma.botToken.findFirst({
      where: {
        isActivated: true,
      },
    });
    return activeBotToken;
  }
}
