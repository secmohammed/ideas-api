import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeasModule } from './ideas/ideas.module';
@Module({
  imports: [TypeOrmModule.forRoot(), IdeasModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
