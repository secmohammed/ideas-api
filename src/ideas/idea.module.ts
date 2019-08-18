import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaService } from './idea.service';
import { IdeaEntity } from './idea.entity';
import { UserEntity } from '../users/user.entity';
import { IdeaController } from './idea.controller';
@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity, UserEntity])],
  providers: [IdeaService],
  controllers: [IdeaController],
})
export class IdeaModule {}
