import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Module({
  providers: [AuthService, { provide: 'APP_GUARD', useClass: AuthGuard }]
})
export class AuthModule { }
