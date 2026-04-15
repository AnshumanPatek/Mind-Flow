import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TopicProgress } from './schemas/topic-progress.schema';
import { ToggleTopicProgressDto } from './dto/toggle-topic-progress.dto';

@Injectable()
export class TopicProgressService {
  constructor(
    @InjectModel(TopicProgress.name)
    private readonly topicProgressModel: Model<TopicProgress>,
  ) {}

  async toggleProgress(dto: ToggleTopicProgressDto): Promise<TopicProgress> {
    const existing = await this.topicProgressModel.findOne({
      topicId: new Types.ObjectId(dto.topicId),
      userId: new Types.ObjectId(dto.userId),
      goalId: new Types.ObjectId(dto.goalId),
    });

    if (existing) {
      // Toggle completion status
      existing.isCompleted = !existing.isCompleted;
      existing.completedAt = existing.isCompleted ? new Date() : undefined;
      return existing.save();
    } else {
      // Create new progress entry as completed
      return this.topicProgressModel.create({
        topicId: new Types.ObjectId(dto.topicId),
        userId: new Types.ObjectId(dto.userId),
        goalId: new Types.ObjectId(dto.goalId),
        isCompleted: true,
        completedAt: new Date(),
      });
    }
  }

  async getProgressByGoal(goalId: string, userId: string): Promise<TopicProgress[]> {
    return this.topicProgressModel
      .find({
        goalId: new Types.ObjectId(goalId),
        userId: new Types.ObjectId(userId),
        isCompleted: true,
      })
      .exec();
  }

  async getProgressByGoalAllUsers(goalId: string): Promise<TopicProgress[]> {
    return this.topicProgressModel
      .find({
        goalId: new Types.ObjectId(goalId),
        isCompleted: true,
      })
      .exec();
  }
}
