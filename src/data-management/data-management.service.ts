import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import {
  CreateBotTokenDto,
  CreateOpenAiKeyDto,
} from './dto/create-data-management.dto';

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

      if (!activeBotToken) {
        throw new Error('Bot token not found');
      }

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

  async newOpenAiKey(data: CreateOpenAiKeyDto) {
    try {
      const gptKey = await this.prisma.openAIKey.create({
        data,
      });
      return {
        error: false,
        message: `OpenAI key set successfully, ${gptKey.name} - ${gptKey.key}`,
      };
    } catch (error) {
      return { error: true, message: `newOpenAIKey error: ${error}` };
    }
  }

  async getOpenAiKey() {
    try {
      const gptKey = await this.prisma.openAIKey.findFirst();
      if (!gptKey) {
        throw new Error('OpenAI key not found');
      }
      return { error: false, data: gptKey, message: 'OpenAI key found' };
    } catch (error) {
      return { error: true, message: `getOpenAIKey error: ${error}` };
    }
  }

  async deleteOpenAiKey(name: string) {
    try {
      const gptKey = await this.prisma.openAIKey.findUnique({
        where: {
          name,
        },
      });
      if (!gptKey) {
        throw new Error('OpenAI key not found');
      }
      await this.prisma.openAIKey.delete({
        where: {
          name,
        },
      });
      return {
        error: false,
        message: `OpenAI key deleted, ${gptKey.name} - ${gptKey.key}`,
      };
    } catch (error) {
      return { error: true, message: `deleteOpenAIKey error: ${error}` };
    }
  }

  async activateOpenAiKey(name: string) {
    try {
      const gptKey = await this.prisma.openAIKey.findUnique({
        where: {
          name,
        },
      });
      if (!gptKey) {
        throw new Error('OpenAI key not found');
      }

      await this.prisma.openAIKey.updateMany({
        data: {
          isActivated: false,
        },
      });

      await this.prisma.openAIKey.update({
        where: {
          name,
        },
        data: {
          isActivated: true,
        },
      });
      return {
        error: false,
        message: `OpenAI key activated, ${gptKey.name} - ${gptKey.key}`,
      };
    } catch (error) {
      return { error: true, message: `activateOpenAIKey error: ${error}` };
    }
  }
}
