import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomRequest } from './auth.guard';
import { config } from 'dotenv';

config();

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: CustomRequest = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(user);
    if (user.role != 'admin') {
      throw new ForbiddenException('Acces Deny');
    }
    return true;
  }
}
