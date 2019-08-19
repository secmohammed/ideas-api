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
import { Field, ID, ObjectType } from 'type-graphql';
import { IdeaEntity as Idea } from '../ideas/idea.entity';
import { hash } from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { IdeaEntity } from '../ideas/idea.entity';
import { CommentEntity } from '../comments/comment.entity';
@Entity('users')
@ObjectType()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @CreateDateColumn()
  @Field()
  created_at: Date;
  @Column({
    type: 'text',
    unique: true,
  })
  @Field()
  username: string;
  @Column({
    type: 'text',
    unique: true,
  })
  @Field()
  email: string;
  @Column('text')
  password: string;
  @Field(() => [Idea])
  @OneToMany(() => IdeaEntity, idea => idea.author, {
    cascade: true,
  })
  @Field(() => [Idea], { defaultValue: [] })
  ideas: IdeaEntity[];
  @OneToMany(() => CommentEntity, comment => comment.author, {
    cascade: true,
  })
  @Field(() => [Idea], { defaultValue: [] })
  comments: IdeaEntity[];
  @ManyToMany(() => IdeaEntity, { cascade: true })
  @JoinTable()
  @Field(() => [Idea], { defaultValue: [] })
  bookmarks: IdeaEntity[];
  @ManyToMany(() => IdeaEntity, { cascade: true })
  @JoinTable()
  @Field(() => [Idea], { defaultValue: [] })
  upvotes: IdeaEntity[];
  @ManyToMany(() => IdeaEntity, { cascade: true })
  @JoinTable()
  @Field(() => [Idea], { defaultValue: [] })
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
