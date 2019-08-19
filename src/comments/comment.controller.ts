import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Body,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '../shared/auth.guard';
import { CreateComment } from './create-comment.validation';
import { User } from '../users/user.decorator';
import { CommentDTO } from './comment.dto';
import { UUID } from '../users/uuid-validation';
@Controller('/api/comments')
export class CommentController {
  constructor(private comments: CommentService) {}

  @Get(':id')
  show(@Param() { id }: UUID): Promise<CommentDTO> {
    return this.comments.find(id);
  }
  @Get('ideas/:id')
  indexCommentsForIdea(@Param() { id }: UUID) {
    return this.comments.findByIdeaId(id);
  }
  @Get('users/:id')
  indexCommentsForUser(@Param() { id }: UUID) {
    return this.comments.findByUserId(id);
  }

  @Post('/ideas/:id')
  @UseGuards(new AuthGuard())
  store(
    @Param() { id }: UUID,
    @User('id') user: string,
    @Body() data: CreateComment,
  ): Promise<CommentDTO> {
    return this.comments.create(id, user, data);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  destroy(@Param('id') id: string, @User('id') user: string) {
    return this.comments.destroy(id, user);
  }
}
