import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Goal, GoalSchema } from '../goals/schemas/goal.schema';
import { GoalMember, GoalMemberSchema } from '../goals/schemas/goal-member.schema';
import { StudySession, StudySessionSchema } from '../study-sessions/schemas/study-session.schema';
import { Chapter, ChapterSchema } from '../chapters/schemas/chapter.schema';
import { Reaction, ReactionSchema } from '../reactions/schemas/reaction.schema';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Goal.name, schema: GoalSchema },
      { name: GoalMember.name, schema: GoalMemberSchema },
      { name: StudySession.name, schema: StudySessionSchema },
      { name: Chapter.name, schema: ChapterSchema },
      { name: Reaction.name, schema: ReactionSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
