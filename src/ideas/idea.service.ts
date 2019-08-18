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

    if (!idea) {
      throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
    }

    idea = await this.ideas.save(idea);
    return { ...idea, author: user.toResponseObject() };
  }
  async update(
    id: string,
    { title, description }: Partial<IdeaDTO>,
  ): Promise<IdeaDTO | undefined> {
    const updated = await this.ideas.update({ id }, { title, description });
    if (!updated) {
      throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
    }
    let idea = await this.ideas.findOne({ where: { id } });
    if (!idea) {
      throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
    }
    let user = await idea.author;
    return { ...idea, author: user.toResponseObject() };
  }
  async find(id: string): Promise<IdeaDTO | undefined> {
    let idea = await this.ideas.findOne({ where: { id } });
    if (!idea) {
      throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
    }
    const user = await idea.author;
    return { ...idea, author: user.toResponseObject() };
  }
  async destroy(id: string) {
    const idea = await this.ideas.delete({ id });
    if (!idea) {
      throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
    }

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
  private ideaToResponseObject(idea: Idea): IdeaDTO {
    const responseObject: any = {
      ...idea,
      author: idea.author ? idea.author.toResponseObject(false) : null,
    };
    return responseObject;
  }
}
