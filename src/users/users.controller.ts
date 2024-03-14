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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.checkError(await this.usersService.create(createUserDto));
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
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
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
