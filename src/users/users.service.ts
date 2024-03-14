import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { name, telegramId, roleId } = createUserDto;
      const role = await this.prisma.role.findUnique({
        where: { id: roleId },
        include: { users: true },
      });

      if (!role) {
        throw new Error('Роль не найдена');
      }

      if (role.users.length >= role.maxUsers) {
        throw new Error(
          'Превышено максимальное количество пользователей для этой роли',
        );
      }

      const newUser = await this.prisma.user.create({
        data: {
          name: name,
          telegramId: telegramId,
          role: {
            connect: { id: roleId },
          },
        },
      });
      return { error: false, data: newUser, message: 'User created' };
    } catch (error) {
      return { error: true, message: `createUser error: ${error.message}` };
    }
  }

  async findAll() {
    try {
      const allUsers = await this.prisma.user.findMany();
      return { error: false, data: allUsers, message: 'Users found' };
    } catch (error) {
      return { error: true, message: `getUsers error: ${error}` };
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          telegramId: id,
        },
      });
      if (!user) {
        throw new Error('User not found');
      }

      return { error: false, data: user, message: 'User found' };
    } catch (error) {
      return { error: true, message: `getUser error: ${error}` };
    }
  }

  async update(id: number, updateUserDto: CreateUserDto) {
    try {
      const { name } = updateUserDto;
      const updatedUser = await this.prisma.user.update({
        where: { telegramId: id },
        data: {
          name: name,
        },
      });
      return { error: false, data: updatedUser, message: 'User updated' };
    } catch (error) {
      return { error: true, message: `updateUser error: ${error}` };
    }
  }

  async remove(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { telegramId: id },
      });
      if (!user) {
        throw new Error('User not found');
      }
      if (user.roleId === 1) {
        return { error: true, message: 'Cannot delete user with role id 1' };
      }
      await this.prisma.user.delete({
        where: { telegramId: id },
      });
      return { error: false, message: 'User deleted' };
    } catch (error) {
      return { error: true, message: `deleteUser error: ${error.message}` };
    }
  }

  async createNewRole(name: string, maxUsers: number) {
    try {
      const newRole = await this.prisma.role.create({
        data: {
          name,
          maxUsers,
        },
      });
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
}
