import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaService } from './idea.service';
import { IdeaEntity } from './idea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity])],
  providers: [IdeaService],
})
export class IdeasModule {}
