import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, FilterQuery } from 'mongoose';
import { StudySession } from './schemas/study-session.schema';
import { CreateStudySessionDto } from './dto/create-study-session.dto';
import { QueryStudySessionDto } from './dto/query-study-session.dto';

@Injectable()
export class StudySessionsService {
  constructor(
    @InjectModel(StudySession.name) private readonly sessionModel: Model<StudySession>,
  ) {}

  async create(dto: CreateStudySessionDto): Promise<StudySession> {
    const session = new this.sessionModel({
      durationSeconds: dto.durationSeconds,
      startedAt: new Date(dto.startedAt),
      userId: new Types.ObjectId(dto.userId),
      goalId: new Types.ObjectId(dto.goalId),
      ...(dto.chapterId && { chapterId: new Types.ObjectId(dto.chapterId) }),
    });
    return session.save();
  }

  async findAll(query: QueryStudySessionDto): Promise<StudySession[]> {
    const filter: FilterQuery<StudySession> = {};

    if (query.userId) filter.userId = new Types.ObjectId(query.userId);
    if (query.goalId) filter.goalId = new Types.ObjectId(query.goalId);
    if (query.chapterId) filter.chapterId = new Types.ObjectId(query.chapterId);

    return this.sessionModel
      .find(filter)
      .populate('userId', 'name email avatar')
      .sort({ startedAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<StudySession> {
    const session = await this.sessionModel
      .findById(id)
      .populate('userId', 'name email avatar')
      .exec();
    if (!session) {
      throw new NotFoundException(`Study session with ID "${id}" not found`);
    }
    return session;
  }

  async remove(id: string): Promise<void> {
    const result = await this.sessionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Study session with ID "${id}" not found`);
    }
  }

  /**
   * Get aggregated study stats for a user within a goal.
   */
  async getUserGoalStats(userId: string, goalId: string) {
    const result = await this.sessionModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          goalId: new Types.ObjectId(goalId),
        },
      },
      {
        $group: {
          _id: null,
          totalSeconds: { $sum: '$durationSeconds' },
          sessionCount: { $sum: 1 },
          lastSession: { $max: '$startedAt' },
        },
      },
    ]);

    return result[0] || { totalSeconds: 0, sessionCount: 0, lastSession: null };
  }
}
