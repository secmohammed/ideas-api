import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaModule } from './ideas/idea.module';
@Module({
  imports: [TypeOrmModule.forRoot(), IdeaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
