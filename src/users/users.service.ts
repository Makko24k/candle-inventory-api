import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  // GET /users  (the Password column is never loaded or returned)
  findAll() {
    return this.userRepo.find({
      select: { userId: true, fullName: true, username: true, role: true },
      order: { userId: 'ASC' },
    });
  }

  // POST /users
  async create(dto: CreateUserDto) {
    // The username must be unique
    const existing = await this.userRepo.findOne({
      where: { username: dto.username },
    });
    if (existing) {
      throw new ConflictException({
        message: 'Username already exists.',
        errors: [`Username ${dto.username} is already taken.`],
      });
    }

    const user = this.userRepo.create({
      fullName: dto.fullName,
      username: dto.username,
      password: await hash(dto.password, 10), // save the HASH, not the password
      role: dto.role,
    });
    const saved = await this.userRepo.save(user);

    // Send back everything EXCEPT the password
    return {
      userId: saved.userId,
      fullName: saved.fullName,
      username: saved.username,
      role: saved.role,
    };
  }
}