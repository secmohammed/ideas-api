import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';

import { AuthGuard } from '../shared/auth.guard';
import { User } from './user.decorator';
import { UUID } from './uuid-validation';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { LoginUser } from './login-user.validation';

import { RegisterUser } from './register-user.validation';
@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly users: UserService) {}
  @Query(() => [UserEntity], { name: 'users' })
  index(
    @Args({ name: 'page', type: () => Number, defaultValue: 1 }) page: number,
  ) {
    return this.users.get(page);
  }
  @Mutation(() => UserEntity)
  login(@Args('data') data: LoginUser) {
    return this.users.login(data);
  }
  @Mutation(() => UserEntity)
  register(@Args('data') data: RegisterUser) {
    return this.users.register(data);
  }
  @Query(() => UserEntity)
  @UseGuards(new AuthGuard())
  me(@User() { id }: UUID) {
    return this.users.me({ id });
  }
}
