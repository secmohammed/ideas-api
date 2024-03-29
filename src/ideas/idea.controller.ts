import { IdeaService } from './idea.service';
import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '../shared/auth.guard';
import { User } from '../users/user.decorator';
import { CreateIdea } from './create-idea.validation';
import { UUID } from '../users/uuid-validation';
import { IdeaDTO } from './idea.dto';
@Controller('api/ideas')
export class IdeaController {
  constructor(private readonly ideas: IdeaService) {}
  @Get()
  index(@Query('page') page: number): Promise<IdeaDTO[]> {
    return this.ideas.get(page);
  }
  @Post()
  @UseGuards(new AuthGuard())
  store(
    @User() { id }: UUID,
    @Body()
    { title, description }: CreateIdea,
  ): Promise<IdeaDTO | undefined> {
    return this.ideas.create({ title, description }, { id });
  }
  @Get(':id')
  async show(@Param('id') id: string): Promise<IdeaDTO> {
    return this.ideas.find(id);
  }
  @Put(':id')
  @UseGuards(new AuthGuard())
  update(
    @User() { id }: UUID,
    @Param('id') ideaId: string,
    @Body() { title, description }: CreateIdea,
  ): Promise<IdeaDTO | undefined> {
    return this.ideas.update(ideaId, { title, description }, { id });
  }
  @Delete(':id')
  @UseGuards(new AuthGuard())
  destroy(@Param('id') ideaId: string, @User() user: any) {
    return this.ideas.destroy(ideaId, user);
  }
}
