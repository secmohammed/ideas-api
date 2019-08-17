import { IdeaService } from './idea.service';
import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateIdea } from './create-idea.validation';
import { IdeaDTO } from './idea.dto';
@Controller('ideas')
export class IdeaController {
  constructor(private readonly ideas: IdeaService) {}
  @Get()
  index(): Promise<IdeaDTO[]> {
    return this.ideas.get();
  }
  @Post()
  store(@Body()
  {
    title,
    description,
  }: CreateIdea): Promise<IdeaDTO | undefined> {
    return this.ideas.create({ title, description });
  }
  @Get(':id')
  async show(@Param('id') id: string): Promise<IdeaDTO> {
    const idea = await this.ideas.find(id);
    if (!idea) {
      throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
    }
    return idea;
  }
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() { title, description }: CreateIdea,
  ): Promise<IdeaDTO | undefined> {
    return this.ideas.update(id, { title, description });
  }
  @Delete(':id')
  destroy(@Param('id') id: string) {
    return this.ideas.destroy(id);
  }
}
