import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async createToken() {
    return {
      access_token: await this.jwtService.signAsync({
        telegramId: 'SUPER_USER',
      }),
    };
  }
}
