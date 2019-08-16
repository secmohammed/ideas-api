import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdeaEntity as Idea } from './idea.entity';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(Idea)
    private readonly ideaRepository: Repository<Idea>,
  ) {}

  findAll(): Promise<Idea[]> {
    return this.ideaRepository.find();
  }
}
