import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdeaEntity as Idea } from './idea.entity';
import { IdeaDTO } from './idea.dto';
@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(Idea)
    private readonly ideaRepository: Repository<Idea>,
  ) {}
  async create(payload: Partial<IdeaDTO>): Promise<IdeaDTO> {
    const idea = await this.ideaRepository.create(payload);
    if (!idea) {
      throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
    }

    await this.ideaRepository.save(idea);
    return idea;
  }
  async update(
    id: string,
    payload: Partial<IdeaDTO>,
  ): Promise<IdeaDTO | undefined> {
    const idea = await this.ideaRepository.update({ id }, payload);
    if (!idea) {
      throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
    }

    return this.ideaRepository.findOne({ where: { id } });
  }
  find(id: string): Promise<IdeaDTO | undefined> {
    return this.ideaRepository.findOne({ where: { id } });
  }
  async destroy(id: string) {
    const idea = await this.ideaRepository.delete({ id });
    if (!idea) {
      throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
    }

    return { deleted: true };
  }
  get(): Promise<IdeaDTO[]> {
    return this.ideaRepository.find();
  }
}
