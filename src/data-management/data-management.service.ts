import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreateBotTokenDto } from './dto/create-data-management.dto';

@Injectable()
export class DataManagementService {
  constructor(private prisma: PrismaService) {}

  async newBotToken(data: CreateBotTokenDto) {
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

  async activateBotToken(botName: string) {
    try {
      const botToken = await this.prisma.botToken.findUnique({
        where: {
          botName,
        },
      });
      if (!botToken) {
        throw new Error('Bot token not found');
      }

      // First, deactivate all bot tokens
      await this.prisma.botToken.updateMany({
        data: {
          isActivated: false,
        },
      });

      // Then, activate the selected bot token
      await this.prisma.botToken.update({
        where: {
          botName,
        },
        data: {
          isActivated: true,
        },
      });
      return {
        error: false,
        message: `Bot token activated, ${botToken.botName} - ${botToken.token}`,
      };
    } catch (error) {
      return { error: true, message: `activateBotToken error: ${error}` };
    }
  }

  async deleteBotToken(botName: string) {
    try {
      const botToken = await this.prisma.botToken.findUnique({
        where: {
          botName,
        },
      });
      if (!botToken) {
        throw new Error('Bot token not found');
      }
      await this.prisma.botToken.delete({
        where: {
          botName,
        },
      });
      return {
        error: false,
        message: `Bot token deleted, ${botToken.botName} - ${botToken.token}`,
      };
    } catch (error) {
      return { error: true, message: `deleteBotToken error: ${error}` };
    }
  }
}
