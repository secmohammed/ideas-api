import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IdeaEntity } from '../ideas/idea.entity';

import { UserEntity } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity, UserEntity])],

  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarksModule {}
