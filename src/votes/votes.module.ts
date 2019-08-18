import { Module } from '@nestjs/common';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IdeaEntity } from '../ideas/idea.entity';

import { UserEntity } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity, UserEntity])],

  controllers: [VoteController],
  providers: [VoteService],
})
export class VotesModule {}
