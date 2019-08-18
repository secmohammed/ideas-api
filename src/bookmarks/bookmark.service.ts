import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdeaEntity as Idea } from '../ideas/idea.entity';
import { UserEntity as User } from '../users/user.entity';
import { UUID } from '../users/uuid-validation';
import { UserDTO } from '../users/user.dto';
@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Idea)
    private readonly ideas: Repository<Idea>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}
  async index({ id }: UUID): Promise<UserDTO> {
    const user = await this.users.findOne({
      where: { id },
      relations: ['bookmarks'],
    });
    if (!user) {
      throw new HttpException(
        'Could not find this record',
        HttpStatus.NOT_FOUND,
      );
    }
    return user.toResponseObject(false);
  }
  async bookmark(ideaId: string, { id }: UUID): Promise<UserDTO> {
    const user = (await this.users.findOne({
      where: { id },
      relations: ['bookmarks'],
    })) as User;

    const idea = (await this.ideas.findOne({ where: { id: ideaId } })) as Idea;

    if (!user.bookmarks.filter(bookmark => bookmark.id === idea.id).length) {
      user.bookmarks.push(idea);
      await this.users.save(user);
    } else {
      throw new HttpException(
        'Idea already bookmarked',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user.toResponseObject(false);
  }
  async unbookmark(ideaId: string, { id }: UUID) {
    const user = (await this.users.findOne({
      where: { id },
      relations: ['bookmarks'],
    })) as User;

    const idea = (await this.ideas.findOne({ where: { id: ideaId } })) as Idea;
    if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length) {
      user.bookmarks = user.bookmarks.filter(
        bookmark => bookmark.id !== idea.id,
      );
      await this.users.save(user);
    } else {
      throw new HttpException(
        'You have not bookmarked this idea yet.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user.toResponseObject(false);
  }
}
