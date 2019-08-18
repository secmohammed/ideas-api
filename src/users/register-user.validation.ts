import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { LoginUser } from './login-user.validation';
export class RegisterUser extends LoginUser {
  @MinLength(8)
  @MaxLength(32)
  @IsNotEmpty()
  password_confirmation: string;
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(32)
  username: string;
}
