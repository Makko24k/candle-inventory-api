import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // The token comes in the header:  Authorization: Bearer <token>
    const header: string | undefined = request.headers['authorization'];
    const [type, token] = header?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token is missing.');
    }

    try {
      // Checks the signature and the expiry, then keeps the payload for later
      request.user = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Token is invalid or expired.');
    }
    return true;
  }
}