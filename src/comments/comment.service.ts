import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { UserEntity } from '../users/user.entity';
import { IdeaEntity } from '../ideas/idea.entity';
import { Repository } from 'typeorm';
import { CreateComment } from './create-comment.validation';
import { CommentDTO } from './comment.dto';
import { IdeaDTO } from '../ideas/idea.dto';
@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private comments: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private users: Repository<UserEntity>,
    @InjectRepository(IdeaEntity)
    private ideas: Repository<IdeaEntity>,
  ) {}
  private ideaToResponseObject(idea: IdeaEntity): IdeaDTO {
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

  private toResponseObject(comment: CommentEntity): CommentDTO {
    const responseObject: any = {
      body: comment.body,
      created_at: comment.created_at,
      id: comment.id,
    };
    if (comment.author) {
      responseObject.author = comment.author.toResponseObject(false);
    }
    if (comment.idea) {
      responseObject.idea = this.ideaToResponseObject(comment.idea);
    }
    return responseObject;
  }
  async find(id: string): Promise<CommentDTO> {
    const comment = await this.comments.findOneOrFail({
      where: { id },
    });
    return this.toResponseObject(comment);
  }
  async findByIdeaId(ideaId: string, page: number = 1): Promise<CommentDTO[]> {
    const comments = (await this.comments.find({
      where: { ideaId },
      relations: ['author', 'idea'],
      take: 25,
      skip: 25 * (page - 1),
    })) as CommentEntity[];
    return comments.map(comment => this.toResponseObject(comment));
  }
  async create(
    ideaId: string,
    userId: string,
    { body }: CreateComment,
  ): Promise<CommentDTO> {
    const idea = await this.ideas.findOneOrFail({ where: { id: ideaId } });
    const author = await this.users.findOneOrFail({ where: { id: userId } });
    const comment = await this.comments.create({
      body,
      idea,
      author,
    });
    await this.comments.save(comment);
    return this.toResponseObject(comment);
  }
  async findByUserId(id: string, page: number = 1): Promise<CommentDTO[]> {
    const comments = (await this.comments.find({
      where: { userId: id },
      relations: ['author', 'idea'],
      take: 25,
      skip: 25 * (page - 1),
    })) as CommentEntity[];
    return comments.map(comment => this.toResponseObject(comment));
  }
  async destroy(id: string, userId: string): Promise<CommentDTO> {
    const comment = await this.comments.findOneOrFail({
      where: { id },
      relations: ['author', 'idea'],
    });
    if (comment.author.id !== userId) {
      throw new HttpException(
        'You do not own this comment.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    await this.comments.remove(comment);
    return this.toResponseObject(comment);
  }
}
