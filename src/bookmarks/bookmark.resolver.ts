import { Resolver } from 'type-graphql';
import { Query, Context, Mutation, Args } from '@nestjs/graphql';
import { BookmarkService } from './bookmark.service';
import { UserEntity } from '../users/user.entity';
import { UUID } from '../users/uuid-validation';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../shared/auth.guard';
@Resolver()
export class BookmarkResolver {
  constructor(private readonly bookmarks: BookmarkService) {}
  @UseGuards(new AuthGuard())
  @Query(() => UserEntity, { name: 'bookmarks' })
  index(@Context('user') { id }: UUID) {
    return this.bookmarks.index({ id });
  }
  @Mutation(() => UserEntity)
  bookmark(
    @Context('user') { id }: UUID,
    @Args({ name: 'idea', type: () => String }) idea: string,
  ) {
    return this.bookmarks.bookmark(idea, { id });
  }
  @UseGuards(new AuthGuard())
  @Mutation(() => UserEntity)
  destroy(
    @Args({ name: 'idea', type: () => String }) idea: string,
    @Context('user') { id }: UUID,
  ) {
    return this.bookmarks.unbookmark(idea, { id });
  }
}
