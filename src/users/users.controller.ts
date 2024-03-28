import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateRoleDto, CreateUserDto } from './dto/create-user.dto';

@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.checkError(await this.usersService.create(createUserDto));
  }

  @Post('create-role')
  @HttpCode(201)
  async createNewRole(@Body() query: CreateRoleDto) {
    return this.checkError(
      await this.usersService.createNewRole(query.name, query.maxUsers),
    );
  }

  @Get('roles')
  async getAllRoles() {
    return this.checkError(await this.usersService.getAllRoles());
  }

  @Get()
  async findAll() {
    return this.checkError(await this.usersService.findAll());
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.checkError(await this.usersService.findOne(+id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.checkError(await this.usersService.update(+id, updateUserDto));
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    return this.checkError(await this.usersService.remove(+id));
  }

  private checkError(resultStatus: { error: boolean; message: string }) {
    if (resultStatus.error) {
      throw new HttpException(
        `${resultStatus.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return resultStatus;
  }
}
