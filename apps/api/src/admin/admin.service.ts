import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { Goal } from '../goals/schemas/goal.schema';
import { GoalMember } from '../goals/schemas/goal-member.schema';
import { StudySession } from '../study-sessions/schemas/study-session.schema';
import { Chapter } from '../chapters/schemas/chapter.schema';
import { Reaction } from '../reactions/schemas/reaction.schema';

@Injectable()
export class AdminService {
  // Users online within the last 60 seconds
  private static readonly ONLINE_THRESHOLD_MS = 60_000;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Goal.name) private readonly goalModel: Model<Goal>,
    @InjectModel(GoalMember.name) private readonly goalMemberModel: Model<GoalMember>,
    @InjectModel(StudySession.name) private readonly sessionModel: Model<StudySession>,
    @InjectModel(Chapter.name) private readonly chapterModel: Model<Chapter>,
    @InjectModel(Reaction.name) private readonly reactionModel: Model<Reaction>,
  ) {}

  /**
   * Dashboard stats: total counts and active user count.
   */
  async getStats(): Promise<Record<string, number>> {
    const onlineThreshold = new Date(Date.now() - AdminService.ONLINE_THRESHOLD_MS);

    const [totalUsers, totalGoals, totalSessions, totalChapters, totalReactions, activeUsers] =
      await Promise.all([
        this.userModel.countDocuments().exec(),
        this.goalModel.countDocuments().exec(),
        this.sessionModel.countDocuments().exec(),
        this.chapterModel.countDocuments().exec(),
        this.reactionModel.countDocuments().exec(),
        this.userModel.countDocuments({ lastSeenAt: { $gte: onlineThreshold } }).exec(),
      ]);

    // Total study time across all sessions
    const studyTimeAgg = await this.sessionModel.aggregate([
      { $group: { _id: null, totalSeconds: { $sum: '$durationSeconds' } } },
    ]);
    const totalStudySeconds = studyTimeAgg[0]?.totalSeconds || 0;

    return {
      totalUsers,
      totalGoals,
      totalSessions,
      totalChapters,
      totalReactions,
      activeUsers,
      totalStudySeconds,
      totalStudyHours: Math.round((totalStudySeconds / 3600) * 100) / 100,
    };
  }

  /**
   * All users with their activity summary.
   */
  async getAllUsers(): Promise<Record<string, any>[]> {
    const users = await this.userModel.find().sort({ createdAt: -1 }).lean().exec();

    const usersWithStats: Record<string, any>[] = await Promise.all(
      users.map(async (user) => {
        const [goalCount, sessionAgg, reactionCount] = await Promise.all([
          this.goalMemberModel.countDocuments({ userId: user._id }).exec(),
          this.sessionModel.aggregate([
            { $match: { userId: user._id } },
            {
              $group: {
                _id: null,
                totalSeconds: { $sum: '$durationSeconds' },
                sessionCount: { $sum: 1 },
              },
            },
          ]),
          this.reactionModel.countDocuments({ receiverId: user._id }).exec(),
        ]);

        const stats = sessionAgg[0] || { totalSeconds: 0, sessionCount: 0 };

        return {
          ...user,
          isOnline:
            user.lastSeenAt != null &&
            Date.now() - new Date(user.lastSeenAt).getTime() < AdminService.ONLINE_THRESHOLD_MS,
          goalCount,
          totalStudySeconds: stats.totalSeconds,
          sessionCount: stats.sessionCount,
          reactionsReceived: reactionCount,
        };
      }),
    );

    return usersWithStats;
  }

  /**
   * All goals with progress and member counts.
   */
  async getAllGoals(): Promise<Record<string, any>[]> {
    const goals = await this.goalModel
      .find()
      .populate('adminId', 'name email avatar')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const goalsWithStats: Record<string, any>[] = await Promise.all(
      goals.map(async (goal) => {
        // Get topic IDs for this goal
        const topicDocs = await this.goalModel.db
          .collection('topics')
          .find({ goalId: goal._id }, { projection: { _id: 1 } })
          .toArray();
        const topicIds = topicDocs.map((t) => t._id);

        const [memberCount, totalChapters, completedChapters, sessionAgg] = await Promise.all([
          this.goalMemberModel.countDocuments({ goalId: goal._id }).exec(),
          this.chapterModel.countDocuments({ topicId: { $in: topicIds } }).exec(),
          this.chapterModel.countDocuments({ topicId: { $in: topicIds }, status: 'COMPLETED' }).exec(),
          this.sessionModel.aggregate([
            { $match: { goalId: goal._id } },
            {
              $group: {
                _id: null,
                totalSeconds: { $sum: '$durationSeconds' },
                sessionCount: { $sum: 1 },
              },
            },
          ]),
        ]);

        const sessionStats = sessionAgg[0] || { totalSeconds: 0, sessionCount: 0 };

        return {
          ...goal,
          memberCount,
          totalChapters,
          completedChapters,
          progressPercent:
            totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0,
          totalStudySeconds: sessionStats.totalSeconds,
          sessionCount: sessionStats.sessionCount,
        };
      }),
    );

    return goalsWithStats;
  }

  /**
   * Recent activity feed: latest sessions, reactions.
   */
  async getRecentActivity(limit = 20): Promise<Record<string, any>[]> {
    const [recentSessions, recentReactions] = await Promise.all([
      this.sessionModel
        .find()
        .populate('userId', 'name email avatar')
        .populate('goalId', 'title')
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()
        .exec(),
      this.reactionModel
        .find()
        .populate('giverId', 'name email avatar')
        .populate('receiverId', 'name email avatar')
        .populate('chapterId', 'title')
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()
        .exec(),
    ]);

    // Merge and sort by createdAt
    const activity: Record<string, any>[] = [
      ...recentSessions.map((s: any) => ({
        type: 'study_session',
        data: s,
        createdAt: s.createdAt,
      })),
      ...recentReactions.map((r: any) => ({
        type: 'reaction',
        data: r,
        createdAt: r.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return activity.slice(0, limit);
  }
}
