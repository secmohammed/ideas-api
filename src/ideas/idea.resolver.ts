import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../shared/auth.guard';
import { IdeaEntity } from './idea.entity';
import { CreateIdea } from './create-idea.validation';
import { UUID } from '../users/uuid-validation';
import { User } from '../users/user.decorator';
import { IdeaService } from './idea.service';
@Resolver(() => IdeaEntity)
export class IdeaResolver {
  constructor(private readonly ideas: IdeaService) {}
  @Query(() => [IdeaEntity], { name: 'ideas' })
  index(
    @Args({ name: 'page', defaultValue: 1, type: () => Number }) page: number,
  ) {
    return this.ideas.get(page);
  }
  @Query(() => IdeaEntity, { name: 'idea' })
  show(@Args('id') id: string) {
    return this.ideas.find(id);
  }
  @UseGuards(new AuthGuard())
  @Mutation(() => IdeaEntity, { name: 'createIdea' })
  store(
    @Args('data') { title, description }: CreateIdea,
    @User() { id }: UUID,
  ) {
    return this.ideas.create({ title, description }, { id });
  }
  @UseGuards(new AuthGuard())
  @Mutation(() => IdeaEntity, { name: 'updateIdea' })
  update(
    @User() { id }: UUID,
    @Args('id') ideaId: string,
    @Args('data') { title, description }: CreateIdea,
  ) {
    return this.ideas.update(ideaId, { title, description }, { id });
  }
  @Mutation(() => IdeaEntity, { name: 'destroyIdea' })
  @UseGuards(new AuthGuard())
  destroy(@Args('id') ideaId: string, @User() user: any) {
    return this.ideas.destroy(ideaId, user);
  }
}
