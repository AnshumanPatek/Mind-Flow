import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GoalsModule } from './goals/goals.module';
import { SectionsModule } from './sections/sections.module';
import { TopicsModule } from './topics/topics.module';
import { ChaptersModule } from './chapters/chapters.module';
import { StudySessionsModule } from './study-sessions/study-sessions.module';
import { ReactionsModule } from './reactions/reactions.module';
import { AdminModule } from './admin/admin.module';
import { TopicProgressModule } from './topic-progress/topic-progress.module';
import { StreaksModule } from './streaks/streaks.module';

@Module({
  imports: [
    // Load .env file
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // MongoDB connection using MONGODB_URI from .env
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI', 'mongodb://localhost:27017/mindflow'),
      }),
    }),

    // Feature modules
    UsersModule,
    GoalsModule,
    SectionsModule,
    TopicsModule,
    ChaptersModule,
    StudySessionsModule,
    ReactionsModule,
    AdminModule,
    TopicProgressModule,
    StreaksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
