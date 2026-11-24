import {
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// What the Admin sends to create a new account
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters.' }) // simple password policy
  @MaxLength(100)
  password: string;

  @IsIn(['Admin', 'Staff'], { message: "role must be 'Admin' or 'Staff'." }) // Lab 04 CHECK
  role: string;
}