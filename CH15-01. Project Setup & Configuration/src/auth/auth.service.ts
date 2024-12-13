import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private jwtService: JwtService;
  private jwtSecret: string;

  constructor(jwtService: JwtService, configService: ConfigService) {
    this.jwtService = jwtService;
    this.jwtSecret = configService.get("jwt.secret")
  }

  generateToken(id: number, username: string) {
    return this.jwtService.sign({ id: id, username: username }, {
      secret: this.jwtSecret,
    })
  }

  verifyToken(token: string) {
    const payload = this.jwtService.verify(token, { secret: this.jwtSecret })
    return {
      id: payload.id,
      username: payload.username,
    }
  }
}
