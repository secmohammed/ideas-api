import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity as User } from './user.entity';
import { compareSync } from 'bcryptjs';
import { LoginUser } from './login-user.validation';
import { RegisterUser } from './register-user.validation';
import { UserDTO } from './user.dto';
import { UUID } from './uuid-validation';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}
  async me({ id }: UUID): Promise<UserDTO | undefined> {
    const user = await this.users.findOne({ id });
    if (!user) {
      return undefined;
    }
    return user.toResponseObject(false);
  }
  async get(): Promise<UserDTO[]> {
    const users = await this.users.find();
    return users.map(user => user.toResponseObject(false));
  }
  async login(data: LoginUser): Promise<UserDTO> {
    const user = await this.users.findOne({ where: { email: data.email } });
    if (!user || !compareSync(data.password, user.password)) {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }
    return user.toResponseObject();
  }
  async register({
    email,
    password,
    password_confirmation,
    username,
  }: RegisterUser): Promise<UserDTO> {
    if (password != password_confirmation) {
      throw new HttpException(
        'password and password_confirmation must match each other',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const count = await this.users
      .createQueryBuilder()
      .where('email=:email or username=:username LIMIT 1', {
        email,
        username,
      })
      .getCount();
    if (count) {
      throw new HttpException(
        'Email/Username exists, pick up another ones.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    let user = await this.users.create({
      username,
      email,
      password,
    });
    user = await this.users.save(user);
    return user.toResponseObject();
  }
}
