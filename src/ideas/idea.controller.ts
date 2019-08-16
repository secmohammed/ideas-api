import { IdeaService } from './idea.service';
import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
} from '@nestjs/common';
import { CreateIdea } from './create-idea.validation';
import { IdeaDTO } from './idea.dto';
@Controller('ideas')
export class IdeaController {
  constructor(private readonly ideas: IdeaService) {}
  @Get()
  index() {
    return this.ideas.get();
  }
  @Post()
  async store(@Body() { title, description }: CreateIdea): Promise<
    IdeaDTO | undefined
  > {
    return this.ideas.create({ title, description });
  }
  @Get(':id')
  async show(@Param('id') id: string): Promise<IdeaDTO | undefined> {
    return this.ideas.find(id);
  }
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() { title, description }: CreateIdea,
  ): Promise<IdeaDTO | undefined> {
    return this.ideas.update(id, { title, description });
  }
  @Delete(':id')
  async destroy(@Param('id') id: string) {
    return this.ideas.destroy(id);
  }
}
