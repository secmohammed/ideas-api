import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BeforeInsert,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { hash } from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { IdeaEntity } from '../ideas/idea.entity';
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
    const { id, created_at, username, email, token } = this;
    let responseObject = { id, username, email, created_at };
    if (showToken) {
      return { ...responseObject, token };
    }
    return responseObject;
  }
}
