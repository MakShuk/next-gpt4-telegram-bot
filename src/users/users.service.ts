import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    const { name, telegramId, roleId } = createUserDto;
    const request = this.prisma.user.create({
      data: {
        name: name,
        telegramId: telegramId,
        role: {
          connect: { id: roleId },
        },
      },
    });
    return this.handleRequest(request, 'User created');
  }

  findAll() {
    const request = this.prisma.user.findMany();
    return this.handleRequest(request, 'Users found');
  }

  findOne(id: number) {
    const request = this.prisma.user.findUnique({
      where: {
        telegramId: id,
      },
    });
    return this.handleRequest(request, 'User found');
  }

  update(id: number, updateUserDto: CreateUserDto) {
    const { name } = updateUserDto;
    const request = this.prisma.user.update({
      where: { telegramId: id },
      data: {
        name: name,
      },
    });
    return this.handleRequest(request, 'User updated');
  }

  remove(id: number) {
    const request = this.prisma.user.delete({
      where: { telegramId: id },
    });
    return this.handleRequest(request, 'User deleted');
  }

  createNewRole(name: string, maxUsers: number) {
    const request = this.prisma.role.create({
      data: {
        name,
        maxUsers,
      },
    });
    return this.handleRequest(request, 'Role created successfully');
  }

  getAllRoles() {
    const request = this.prisma.role.findMany();
    return this.handleRequest(request, 'Roles found');
  }

  userExists(telegramId: number) {
    const request = this.prisma.user.findUnique({
      where: { telegramId },
    });
    return this.handleRequest(request, 'User found');
  }

  private async handleRequest<T>(request: Promise<T>, successMessage: string) {
    try {
      const data = await request;
      return { error: false, data, message: successMessage };
    } catch (error) {
      return {
        error: true,
        message: `${successMessage} error: ${(error as Error).message}`,
      };
    }
  }
}
