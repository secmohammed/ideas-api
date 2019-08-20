import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IdeaEntity } from '../ideas/idea.entity';
import { BookmarkResolver } from './bookmark.resolver';
import { UserEntity } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity, UserEntity])],

  controllers: [BookmarkController],
  providers: [BookmarkService, BookmarkResolver],
})
export class BookmarksModule {}
