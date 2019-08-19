import { Resolver, Query } from '@nestjs/graphql';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  @Query(() => [UserEntity])
  users() {
    return this.userService.get();
  }
}
