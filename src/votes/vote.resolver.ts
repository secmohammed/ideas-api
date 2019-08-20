import { VoteService } from './vote.service';
import { Resolver } from 'type-graphql';
import { AuthGuard } from '../shared/auth.guard';
import { Context, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UUID } from '../users/uuid-validation';
import { UserEntity } from '../users/user.entity';
@Resolver(() => UserEntity)
export class VoteResolver {
  constructor(private readonly votes: VoteService) {}
  @Query(() => UserEntity, { name: 'votes' })
  @UseGuards(new AuthGuard())
  index(@Context('user') { id }: UUID) {
    return this.votes.index({ id });
  }
  @UseGuards(new AuthGuard())
  @Mutation(() => UserEntity, { name: 'upvote' })
  store(
    @Args({ name: 'idea', type: () => String }) idea: string,
    @Context('user') { id }: UUID,
  ) {
    return this.votes.upvote(idea, { id });
  }
  @UseGuards(new AuthGuard())
  @Mutation(() => UserEntity, { name: 'downvote' })
  destroy(
    @Args({ name: 'idea', type: () => String }) idea: string,
    @Context('user') { id }: UUID,
  ) {
    return this.votes.downvote(idea, { id });
  }
}
