import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from 'src/core/request/authenticated_request';
import { Reflector } from '@nestjs/core';
import { SKIP_AUTH_GUARD } from 'src/core/decorators/skip_auth';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const skipped = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_GUARD, [
      context.getHandler(),
      context.getClass()
    ])

    if (skipped) {
      return true;
    }


    const req = context.switchToHttp().getRequest<AuthenticatedRequest>()

    // ambil token dari header authorization
    // Bearer <token>
    const bearerToken = req.headers["authorization"]
    if (!bearerToken) {
      throw new UnauthorizedException();
    }

    const token = bearerToken.split(" ")[1]
    if (!token) {
      throw new UnauthorizedException();
    }

    // verify token dan ambil payload
    const payload = this.authService.verifyToken(token)
    if (!payload) {
      throw new UnauthorizedException();
    }

    // menyimpan payload kedalam http request
    req.user = {
      id: payload.id,
      username: payload.username
    }

    return true;
  }
}
