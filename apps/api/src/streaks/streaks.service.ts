import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Streak } from './schemas/streak.schema';

@Injectable()
export class StreaksService {
  constructor(
    @InjectModel(Streak.name) private readonly streakModel: Model<Streak>,
  ) {}

  async updateStreak(userId: string): Promise<Streak> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = await this.streakModel.findOne({ userId: new Types.ObjectId(userId) });

    if (!streak) {
      // Create new streak
      streak = new this.streakModel({
        userId: new Types.ObjectId(userId),
        currentStreak: 1,
        longestStreak: 1,
        lastStudyDate: today,
        studyDates: [today],
      });
      return streak.save();
    }

    // Check if already studied today
    const lastDate = streak.lastStudyDate ? new Date(streak.lastStudyDate) : null;
    if (lastDate) {
      lastDate.setHours(0, 0, 0, 0);
      
      if (lastDate.getTime() === today.getTime()) {
        // Already studied today, no update needed
        return streak;
      }

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastDate.getTime() === yesterday.getTime()) {
        // Consecutive day - increment streak
        streak.currentStreak += 1;
      } else {
        // Streak broken - reset to 1
        streak.currentStreak = 1;
      }
    } else {
      // First study session
      streak.currentStreak = 1;
    }

    // Update longest streak if current is higher
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }

    streak.lastStudyDate = today;
    streak.studyDates.push(today);

    return streak.save();
  }

  async getStreak(userId: string): Promise<Streak | null> {
    return this.streakModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
  }

  async getAllStreaks(): Promise<Streak[]> {
    return this.streakModel.find().populate('userId', 'name email avatar').sort({ currentStreak: -1 }).exec();
  }
}
