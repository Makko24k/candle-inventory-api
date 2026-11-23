import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No @Roles(...) on the endpoint: any logged-in user can use it
    if (!allowedRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException('You are not allowed to do this.');
    }
    return true;
  }
}