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
    const user = await this.users.findOne({ id });
    if (!user) {
      throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
    }
    let idea = await this.ideas.create({ title, description });
    idea.author = user;
    if (!idea) {
      throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
    }
    await this.ideas.save(idea);
    return this.ideaToResponseObject(idea);
  }
  async update(
    id: string,
    { title, description }: Partial<IdeaDTO>,
    token: UUID,
  ): Promise<IdeaDTO | undefined> {
    let idea = await this.ideas.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!idea) {
      throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
    }

    this.ensureOwnership(idea, token);
    const updated = await this.ideas.update({ id }, { title, description });
    if (!updated) {
      throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
    }
    idea = (await this.ideas.findOne({ where: { id } })) as Idea;
    return this.ideaToResponseObject(idea);
  }
  async find(id: string): Promise<IdeaDTO> {
    let idea = await this.ideas.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!idea) {
      throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
    }
    return this.ideaToResponseObject(idea);
  }
  async destroy(id: string, user: UUID) {
    let idea = await this.ideas.findOne({ where: { id } });
    if (!idea) {
      throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(idea, user);
    await this.ideas.delete({ id });
    return { deleted: true };
  }
  async get(page: number = 1) {
    const options: FindManyOptions = {
      relations: ['author'],
      take: 25,
      order: {
        created_at: 'DESC',
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
    return responseObject;
  }
}
