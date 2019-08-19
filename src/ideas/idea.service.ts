import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { IdeaEntity as Idea } from './idea.entity';
import { UserEntity as User } from '../users/user.entity';
import { IdeaDTO } from './idea.dto';
import { UUID } from '../users/uuid-validation';
@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(Idea)
    private readonly ideas: Repository<Idea>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}
  async create(
    { title, description }: Partial<IdeaDTO>,
    { id }: UUID,
  ): Promise<IdeaDTO> {
    const user = await this.users.findOneOrFail({ id });
    let idea = await this.ideas.create({ title, description });
    idea.author = user;
    await this.ideas.save(idea);
    return this.ideaToResponseObject(idea);
  }
  async update(
    id: string,
    { title, description }: Partial<IdeaDTO>,
    token: UUID,
  ): Promise<IdeaDTO | undefined> {
    let idea = await this.ideas.findOneOrFail({
      where: { id },
      relations: ['author'],
    });

    this.ensureOwnership(idea, token);
    await this.ideas.update({ id }, { title, description });
    idea = (await this.ideas.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes'],
    })) as Idea;
    return this.ideaToResponseObject(idea);
  }
  async find(id: string): Promise<IdeaDTO> {
    let idea = await this.ideas.findOneOrFail({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes'],
    });
    return this.ideaToResponseObject(idea);
  }
  async destroy(id: string, user: UUID) {
    let idea = await this.ideas.findOneOrFail({ where: { id } });
    this.ensureOwnership(idea, user);
    await this.ideas.delete({ id });
    return idea;
  }
  async get(page: number = 1, recent: boolean = true) {
    const options: FindManyOptions = {
      relations: ['author', 'upvotes', 'downvotes'],
      take: 25,
      order: {
        created_at: recent ? 'DESC' : 'ASC',
      },
      skip: 25 * (page - 1),
    };
    const ideas = await this.ideas.find(options);
    return ideas.map((idea: Idea) => this.ideaToResponseObject(idea));
  }
  private ensureOwnership(idea: Idea, { id }: UUID) {
    if (idea.author.id !== id) {
      throw new HttpException('Unauthorized attempt', HttpStatus.UNAUTHORIZED);
    }
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
