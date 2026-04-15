import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StreaksController } from './streaks.controller';
import { StreaksService } from './streaks.service';
import { Streak, StreakSchema } from './schemas/streak.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Streak.name, schema: StreakSchema }]),
  ],
  controllers: [StreaksController],
  providers: [StreaksService],
  exports: [StreaksService],
})
export class StreaksModule {}
