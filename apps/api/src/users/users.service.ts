import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { StudySession } from '../study-sessions/schemas/study-session.schema';
import { TopicProgress } from '../topic-progress/schemas/topic-progress.schema';
import { Reaction } from '../reactions/schemas/reaction.schema';
import { Streak } from '../streaks/schemas/streak.schema';

@Injectable()
export class UsersService {
  // Users online within the last 60 seconds are considered "online"
  private static readonly ONLINE_THRESHOLD_MS = 60_000;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(StudySession.name) private readonly studySessionModel: Model<StudySession>,
    @InjectModel(TopicProgress.name) private readonly topicProgressModel: Model<TopicProgress>,
    @InjectModel(Reaction.name) private readonly reactionModel: Model<Reaction>,
    @InjectModel(Streak.name) private readonly streakModel: Model<Streak>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { $set: updateUserDto }, { new: true, runValidators: true })
      .exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }

  async heartbeat(id: string): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { $set: { lastSeenAt: new Date() } }, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  isOnline(user: User): boolean {
    if (!user.lastSeenAt) return false;
    return Date.now() - new Date(user.lastSeenAt).getTime() < UsersService.ONLINE_THRESHOLD_MS;
  }

  async getOnlineUserIds(): Promise<string[]> {
    const threshold = new Date(Date.now() - UsersService.ONLINE_THRESHOLD_MS);
    const users = await this.userModel
      .find({ lastSeenAt: { $gte: threshold } }, { _id: 1 })
      .exec();
    return users.map((u) => u._id.toString());
  }

  async getUserStats(userId: string): Promise<any> {
    const userObjectId = new Types.ObjectId(userId);

    // Aggregate study sessions for total hours
    const sessions = await this.studySessionModel.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, totalSeconds: { $sum: '$durationSeconds' } } },
    ]);

    // Count completed topics
    const completedTopics = await this.topicProgressModel.countDocuments({
      userId: userObjectId,
      isCompleted: true,
    });

    // Count respect received
    const respect = await this.reactionModel.countDocuments({
      receiverId: userObjectId,
    });

    // Get streak
    const streak = await this.streakModel.findOne({ userId: userObjectId });

    return {
      totalHours: Math.round((sessions[0]?.totalSeconds || 0) / 3600),
      chaptersCompleted: completedTopics,
      respectPoints: respect,
      streak: streak?.currentStreak || 0,
    };
  }
}
