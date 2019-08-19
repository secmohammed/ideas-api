import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BeforeInsert,
  BaseEntity,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { hash } from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { IdeaEntity } from '../ideas/idea.entity';
import { CommentEntity } from '../comments/comment.entity';
@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;
  @Column({
    type: 'text',
    unique: true,
  })
  username: string;
  @Column({
    type: 'text',
    unique: true,
  })
  email: string;
  @Column('text')
  password: string;

  @OneToMany(() => IdeaEntity, idea => idea.author, {
    cascade: true,
  })
  ideas: IdeaEntity[];
  @OneToMany(() => CommentEntity, comment => comment.author, {
    cascade: true,
  })
  comments: IdeaEntity[];
  @ManyToMany(() => IdeaEntity, { cascade: true })
  @JoinTable()
  bookmarks: IdeaEntity[];
  @ManyToMany(() => IdeaEntity, { cascade: true })
  @JoinTable()
  upvotes: IdeaEntity[];
  @ManyToMany(() => IdeaEntity, { cascade: true })
  @JoinTable()
  downvotes: IdeaEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 12);
  }
  private get token() {
    const { id } = this;
    return jwt.sign({ id }, process.env.SECRET_TOKEN || 'blabla', {
      expiresIn: '7d',
    });
  }
  toResponseObject(showToken: boolean = true) {
    const {
      id,
      created_at,
      username,
      email,
      token,
      ideas,
      bookmarks,
      upvotes,
      downvotes,
      comments,
    } = this;
    let responseObject: any = { id, username, email, created_at };
    if (showToken) {
      responseObject.token = token;
    }
    if (comments) {
      responseObject.comments = comments;
    }
    if (ideas) {
      responseObject.ideas = ideas;
    }
    if (bookmarks) {
      responseObject.bookmarks = bookmarks;
    }
    if (upvotes && upvotes.length) {
      responseObject.upvotes = upvotes;
      responseObject.upvotes_count = upvotes.length;
    }
    if (downvotes && downvotes.length) {
      responseObject.downvotes = downvotes;
      responseObject.downvotes_count = downvotes.length;
    }
    return responseObject;
  }
}
