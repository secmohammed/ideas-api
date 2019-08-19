import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { IdeaEntity } from '../ideas/idea.entity';
import { UserEntity } from '../users/user.entity';
@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;
  @Column('text')
  body: string;

  @ManyToOne(() => UserEntity, author => author.comments, {
    eager: true,
  })
  @JoinTable()
  author: UserEntity;
  @ManyToOne(() => IdeaEntity, idea => idea.comments)
  idea: IdeaEntity;
}
