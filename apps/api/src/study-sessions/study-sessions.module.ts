import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudySession, StudySessionSchema } from './schemas/study-session.schema';
import { StudySessionsController } from './study-sessions.controller';
import { StudySessionsService } from './study-sessions.service';
import { StreaksModule } from '../streaks/streaks.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: StudySession.name, schema: StudySessionSchema }]),
    StreaksModule,
  ],
  controllers: [StudySessionsController],
  providers: [StudySessionsService],
  exports: [StudySessionsService],
})
export class StudySessionsModule {}
