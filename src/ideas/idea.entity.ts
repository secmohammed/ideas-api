import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('ideas')
export class IdeaEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @CreateDateColumn()
  created_at: Date;
}
