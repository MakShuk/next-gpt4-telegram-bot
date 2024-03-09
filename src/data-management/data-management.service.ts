import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

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
}
