import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { IdeaEntity } from '../ideas/idea.entity';
import { ID, Field, ObjectType } from 'type-graphql';
import { UserEntity } from '../users/user.entity';
@Entity('comments')
@ObjectType()
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @CreateDateColumn()
  @Field()
  created_at: Date;
  @Column('text')
  @Field()
  body: string;

  @ManyToOne(() => UserEntity, author => author.comments, {
    eager: true,
  })
  @JoinTable()
  @Field(() => UserEntity)
  author: UserEntity;
  @ManyToOne(() => IdeaEntity, idea => idea.comments)
  @Field(() => IdeaEntity)
  idea: IdeaEntity;
}
