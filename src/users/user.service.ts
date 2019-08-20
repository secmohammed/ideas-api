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
  async me({ id }: UUID): Promise<UserDTO> {
    const user = await this.users.findOneOrFail({ id });
    return user.toResponseObject(false);
  }
  async get(page: number = 1) {
    const options = {
      relations: ['ideas', 'bookmarks'],
      skip: 25 * (page - 1),
      take: 25,
    };
    const users = await this.users.find(options);
    // safer to do so for the rest api to hide the password field, however this is reduandant for graphql
    return users.map(user => user.toResponseObject(false));
  }
  async login(data: LoginUser): Promise<UserDTO> {
    const user = await this.users.findOneOrFail({
      where: { email: data.email },
    });
    if (!compareSync(data.password, user.password)) {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }
    console.log(user);
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
