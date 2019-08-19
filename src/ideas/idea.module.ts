import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaService } from './idea.service';
import { IdeaEntity } from './idea.entity';
import { UserEntity } from '../users/user.entity';
import { IdeaController } from './idea.controller';
import { IdeaResolver } from './idea.resolver';
@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity, UserEntity])],
  providers: [IdeaService, IdeaResolver],
  controllers: [IdeaController],
})
export class IdeaModule {}
