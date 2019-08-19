import { Resolver, Query, Args } from '@nestjs/graphql';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  @Query(() => [UserEntity])
  users(
    @Args({ name: 'page', type: () => Number, defaultValue: 1 }) page: number,
  ) {
    console.log('>>>>>>>>>>', page);
    return this.userService.get(page);
  }
}
