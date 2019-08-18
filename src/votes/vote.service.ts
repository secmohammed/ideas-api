import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdeaEntity as Idea } from '../ideas/idea.entity';
import { UserEntity as User } from '../users/user.entity';
import { UUID } from '../users/uuid-validation';
import { UserDTO } from '../users/user.dto';
import { IdeaDTO } from '../ideas/idea.dto';
import { Votes } from '../shared/votes.enum';
@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Idea)
    private readonly ideas: Repository<Idea>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}
  private async vote(idea: Idea, user: User, vote: Votes) {
    const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP;
    if (
      idea[opposite].filter(voter => voter.id === user.id).length > 0 ||
      idea[vote].filter(voter => voter.id === user.id).length > 0
    ) {
      idea[opposite] = idea[opposite].filter(voter => voter.id !== user.id);
      idea[vote] = idea[vote].filter(voter => voter.id !== user.id);
      await this.ideas.save(idea);
    } else if (idea[vote].filter(voter => voter.id === user.id).length < 1) {
      idea[vote].push(user);
      await this.ideas.save(idea);
    } else {
      throw new HttpException('Unable to case vote', HttpStatus.BAD_REQUEST);
    }
    return idea;
  }
  async index({ id }: UUID): Promise<UserDTO> {
    const user = await this.users.findOne({
      where: { id },
      relations: ['upvotes', 'downvotes'],
    });
    if (!user) {
      throw new HttpException(
        'Could not find this record',
        HttpStatus.NOT_FOUND,
      );
    }
    return user.toResponseObject(false);
  }
  async upvote(ideaId: string, { id }: UUID) {
    const user = (await this.users.findOne({
      where: { id },
    })) as User;

    let idea = (await this.ideas.findOne({
      where: { id: ideaId },
      relations: ['author', 'upvotes', 'downvotes'],
    })) as Idea;

    idea = await this.vote(idea, user, Votes.UP);

    return this.ideaToResponseObject(idea);
  }
  async downvote(ideaId: string, { id }: UUID) {
    const user = (await this.users.findOne({
      where: { id },
    })) as User;

    let idea = (await this.ideas.findOne({
      where: { id: ideaId },
      relations: ['author', 'upvotes', 'downvotes'],
    })) as Idea;

    idea = await this.vote(idea, user, Votes.DOWN);

    return this.ideaToResponseObject(idea);
  }
  private ideaToResponseObject(idea: Idea): IdeaDTO {
    const responseObject: any = {
      ...idea,
      author: idea.author ? idea.author.toResponseObject(false) : null,
    };
    if (responseObject.upvotes) {
      responseObject.upvotes = idea.upvotes.length;
    }
    if (responseObject.downvotes) {
      responseObject.downvotes = idea.downvotes.length;
    }
    return responseObject;
  }
}
