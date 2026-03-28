import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly adminUsername: string;
  private readonly adminPasswordHash: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
    this.adminUsername = this.config.get('ADMIN_USERNAME', 'admin');
    this.adminPasswordHash = this.config.get(
      'ADMIN_PASSWORD_HASH',
      bcrypt.hashSync('admin1234', 10),
    );
  }

  async login(username: string, password: string) {
    if (username !== this.adminUsername) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(password, this.adminPasswordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: username, role: 'admin' };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
