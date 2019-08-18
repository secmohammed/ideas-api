import {
  Controller,
  Get,
  UseGuards,
  Param,
  Post,
  Delete,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { AuthGuard } from '../shared/auth.guard';
import { User } from '../users/user.decorator';
import { UUID } from '../users/uuid-validation';
import { UserDTO } from '../users/user.dto';
@Controller('/api/bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarks: BookmarkService) {}
  @Get()
  @UseGuards(new AuthGuard())
  index(@User() user: UUID): Promise<UserDTO> {
    return this.bookmarks.index(user);
  }
  @UseGuards(new AuthGuard())
  @Post(':idea')
  store(@Param('idea') idea: string, @User() user: UUID) {
    return this.bookmarks.bookmark(idea, user);
  }
  @UseGuards(new AuthGuard())
  @Delete(':idea')
  destroy(@Param('idea') idea: string, @User() user: UUID) {
    return this.bookmarks.unbookmark(idea, user);
  }
}
