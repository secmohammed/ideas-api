import { Controller, Post, Get, Body, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUser } from './login-user.validation';
import { RegisterUser } from './register-user.validation';
import { AuthGuard } from '../shared/auth.guard';
import { User } from './user.decorator';
import { UUID } from './uuid-validation';
@Controller('api/users')
export class UserController {
  constructor(private readonly users: UserService) {}
  @Get()
  index(@Query('page') page: number) {
    return this.users.get(page);
  }
  @Post('/login')
  login(@Body() data: LoginUser) {
    return this.users.login(data);
  }

  @Post('/register')
  register(@Body() data: RegisterUser) {
    return this.users.register(data);
  }
  @Get('/me')
  @UseGuards(new AuthGuard())
  me(@User() { id }: UUID) {
    return this.users.me({ id });
  }
}
