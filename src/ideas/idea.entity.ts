import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';
@Entity('ideas')
export class IdeaEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @CreateDateColumn()
  created_at: Date;
  @CreateDateColumn()
  updated_at: Date;

  @ManyToOne(() => UserEntity, author => author.ideas, {
    eager: true,
  })
  author: UserEntity;
}
