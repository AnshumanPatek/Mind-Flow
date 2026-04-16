import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { StudySession, StudySessionSchema } from '../study-sessions/schemas/study-session.schema';
import { TopicProgress, TopicProgressSchema } from '../topic-progress/schemas/topic-progress.schema';
import { Reaction, ReactionSchema } from '../reactions/schemas/reaction.schema';
import { Streak, StreakSchema } from '../streaks/schemas/streak.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: StudySession.name, schema: StudySessionSchema },
      { name: TopicProgress.name, schema: TopicProgressSchema },
      { name: Reaction.name, schema: ReactionSchema },
      { name: Streak.name, schema: StreakSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
