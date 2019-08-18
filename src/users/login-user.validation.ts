import { IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator';
export class LoginUser {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
