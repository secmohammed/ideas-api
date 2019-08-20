import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../shared/auth.guard';
import { CreateComment } from './create-comment.validation';
@Resolver(() => CommentEntity)
export class CommentResolver {
  constructor(private readonly comments: CommentService) {}

  @Query(() => CommentEntity, { name: 'showComment' })
  show(@Args('id') id: string) {
    return this.comments.find(id);
  }
  @Query(() => [CommentEntity], { name: 'indexIdeaComments' })
  indexCommentsForIdea(
    @Args('id') id: string,
    @Args({ name: 'page', type: () => Number, defaultValue: 1 }) page: number,
  ) {
    return this.comments.findByIdeaId(id, page);
  }
  @Query(() => [CommentEntity], { name: 'indexUserComments' })
  indexCommentsForUser(
    @Args('id') id: string,
    @Args({ name: 'page', type: () => Number, defaultValue: 1 }) page: number,
  ) {
    return this.comments.findByUserId(id, page);
  }
  @Mutation(() => CommentEntity, { name: 'createComment' })
  @UseGuards(new AuthGuard())
  store(
    @Args('id') id: string,
    @Context('user') user: any,
    @Args('data') data: CreateComment,
  ) {
    return this.comments.create(id, user, data);
  }

  @UseGuards(new AuthGuard())
  @Mutation(() => CommentEntity, { name: 'destroyComment' })
  destroy(@Args('id') id: string, @Context('user') user: any) {
    return this.comments.destroy(id, user);
  }
}
