import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { CommentEntity } from '../comments/comment.entity';
import { Field, ID, ObjectType } from 'type-graphql';

@Entity('ideas')
@ObjectType()
export class IdeaEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column('text')
  @Field()
  title: string;

  @Column('text')
  @Field()
  description: string;

  @CreateDateColumn()
  @Field()
  created_at: Date;
  @CreateDateColumn()
  @Field()
  updated_at: Date;

  @ManyToOne(() => UserEntity, author => author.ideas, {
    eager: true,
  })
  @Field(() => UserEntity)
  author: UserEntity;
  @ManyToMany(() => UserEntity, { cascade: true })
  @JoinTable()
  @Field(() => [UserEntity])
  upvotes: UserEntity[];
  @ManyToMany(() => UserEntity, { cascade: true })
  @JoinTable()
  @Field(() => [UserEntity])
  downvotes: UserEntity[];
  @OneToMany(() => CommentEntity, comments => comments.idea)
  @Field(() => [CommentEntity])
  comments: CommentEntity[];
}
