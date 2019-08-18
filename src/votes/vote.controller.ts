import {
  Controller,
  Get,
  UseGuards,
  Param,
  Post,
  Delete,
} from '@nestjs/common';
import { VoteService } from './vote.service';
import { AuthGuard } from '../shared/auth.guard';
import { User } from '../users/user.decorator';
import { UUID } from '../users/uuid-validation';
import { UserDTO } from '../users/user.dto';
@Controller('/api/votes')
export class VoteController {
  constructor(private readonly votes: VoteService) {}
  @Get()
  @UseGuards(new AuthGuard())
  index(@User() user: UUID): Promise<UserDTO> {
    return this.votes.index(user);
  }
  @UseGuards(new AuthGuard())
  @Post(':idea')
  store(@Param('idea') idea: string, @User() user: UUID) {
    return this.votes.upvote(idea, user);
  }
  @UseGuards(new AuthGuard())
  @Delete(':idea')
  destroy(@Param('idea') idea: string, @User() user: UUID) {
    return this.votes.downvote(idea, user);
  }
}
