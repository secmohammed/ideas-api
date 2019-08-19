import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaEntity } from '../ideas/idea.entity';
import { UserEntity } from '../users/user.entity';
import { CommentEntity } from './comment.entity';
import { CommentResolver } from './comment.resolver';
@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity, UserEntity, CommentEntity])],
  controllers: [CommentController],
  providers: [CommentService, CommentResolver],
})
export class CommentsModule {}
