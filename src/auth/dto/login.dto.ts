import { IsNotEmpty, IsString } from 'class-validator';

// The data we expect when someone logs in
export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}