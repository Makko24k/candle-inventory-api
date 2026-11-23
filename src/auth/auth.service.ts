import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  // Runs once when the app starts: creates the first Admin if the User table is empty
  async onModuleInit() {
    const total = await this.userRepository.count();
    if (total > 0) return;

    const username = this.config.get<string>('ADMIN_USERNAME');
    const password = this.config.get<string>('ADMIN_PASSWORD');
    if (!username || !password) return;

    await this.userRepository.save({
      fullName: 'System Admin',
      username,
      password: await hash(password, 10), // store the HASH, not the password
      role: 'Admin',
    });
    console.log(`First Admin account created: ${username}`);
  }

  async login(dto: LoginDto) {
    // 1. Find the user in the database
    const user = await this.userRepository.findOne({
      where: { username: dto.username },
    });

    // 2. Compare the typed password with the saved hash
    const passwordOk = user ? await compare(dto.password, user.password) : false;

    // Same message for both cases, so attackers can't tell which part was wrong
    if (!user || !passwordOk) {
      throw new UnauthorizedException('Invalid username or password.');
    }

    // 3. Create the JWT (it holds userId, role, and an expiry time)
    const payload = {
      userId: user.userId,
      username: user.username,
      role: user.role,
    };
    return { accessToken: await this.jwtService.signAsync(payload) };
  }
}