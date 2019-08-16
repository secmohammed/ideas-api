import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdeaEntity as Idea } from './idea.entity';
import { IdeaDTO, Idea as IdeaInterface } from './idea.dto';
@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(Idea)
    private readonly ideaRepository: Repository<Idea>,
  ) {}
  async create(payload: IdeaInterface): Promise<IdeaDTO> {
    const idea = await this.ideaRepository.create(payload);
    await this.ideaRepository.save(idea);
    return idea;
  }
  async update(
    id: string,
    payload: IdeaInterface,
  ): Promise<IdeaDTO | undefined> {
    await this.ideaRepository.update({ id }, payload);
    return this.ideaRepository.findOne({ where: { id } });
  }
  async find(id: string): Promise<IdeaDTO | undefined> {
    return this.ideaRepository.findOne({ where: { id } });
  }
  async destroy(id: string) {
    await this.ideaRepository.delete({ id });
    return { deleted: true };
  }
  async get(): Promise<IdeaDTO[]> {
    return this.ideaRepository.find();
  }
}
