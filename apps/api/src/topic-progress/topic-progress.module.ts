import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TopicProgressController } from './topic-progress.controller';
import { TopicProgressService } from './topic-progress.service';
import { TopicProgress, TopicProgressSchema } from './schemas/topic-progress.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TopicProgress.name, schema: TopicProgressSchema },
    ]),
  ],
  controllers: [TopicProgressController],
  providers: [TopicProgressService],
  exports: [TopicProgressService],
})
export class TopicProgressModule {}
