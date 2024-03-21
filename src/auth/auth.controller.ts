import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
//import { Public } from 'src/decorators/custom.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  createToken() {
    return this.authService.createToken();
  }
}
