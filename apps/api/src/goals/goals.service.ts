import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Goal } from './schemas/goal.schema';
import { GoalMember } from './schemas/goal-member.schema';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { GoalRole } from '@mindflow/shared';

@Injectable()
export class GoalsService {
  constructor(
    @InjectModel(Goal.name) private readonly goalModel: Model<Goal>,
    @InjectModel(GoalMember.name) private readonly goalMemberModel: Model<GoalMember>,
  ) {}

  /**
   * Create a goal and auto-add the creator as an ADMIN member.
   */
  async create(createGoalDto: CreateGoalDto): Promise<Goal> {
    const goal = await new this.goalModel(createGoalDto).save();

    // Auto-add creator as ADMIN member
    await new this.goalMemberModel({
      userId: new Types.ObjectId(createGoalDto.adminId),
      goalId: goal._id,
      role: GoalRole.ADMIN,
    }).save();

    return goal;
  }

  async findAll(userId?: string): Promise<Goal[]> {
    if (userId) {
      // Find goals where the user is a member
      const memberships = await this.goalMemberModel
        .find({ userId: new Types.ObjectId(userId) })
        .exec();
      const goalIds = memberships.map((m) => m.goalId);
      return this.goalModel.find({ _id: { $in: goalIds } }).sort({ createdAt: -1 }).exec();
    }
    return this.goalModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<Goal> {
    const goal = await this.goalModel.findById(id).populate('adminId', 'name email avatar').exec();
    if (!goal) {
      throw new NotFoundException(`Goal with ID "${id}" not found`);
    }
    return goal;
  }

  async update(id: string, updateGoalDto: UpdateGoalDto): Promise<Goal> {
    const goal = await this.goalModel
      .findByIdAndUpdate(id, { $set: updateGoalDto }, { new: true, runValidators: true })
      .exec();
    if (!goal) {
      throw new NotFoundException(`Goal with ID "${id}" not found`);
    }
    return goal;
  }

  async remove(id: string): Promise<void> {
    const goal = await this.goalModel.findByIdAndDelete(id).exec();
    if (!goal) {
      throw new NotFoundException(`Goal with ID "${id}" not found`);
    }
    // Cascade: remove all members of this goal
    await this.goalMemberModel.deleteMany({ goalId: goal._id }).exec();
  }

  // ─── Member Management ──────────────────────────────────

  async addMember(goalId: string, addMemberDto: AddMemberDto): Promise<GoalMember> {
    // Verify goal exists
    const goal = await this.goalModel.findById(goalId).exec();
    if (!goal) {
      throw new NotFoundException(`Goal with ID "${goalId}" not found`);
    }

    const member = new this.goalMemberModel({
      goalId: new Types.ObjectId(goalId),
      userId: new Types.ObjectId(addMemberDto.userId),
      role: addMemberDto.role || GoalRole.USER,
    });
    return member.save();
  }

  async getMembers(goalId: string): Promise<GoalMember[]> {
    return this.goalMemberModel
      .find({ goalId: new Types.ObjectId(goalId) })
      .populate('userId', 'name email avatar lastSeenAt')
      .sort({ createdAt: 1 })
      .exec();
  }

  async removeMember(goalId: string, userId: string): Promise<void> {
    const result = await this.goalMemberModel
      .findOneAndDelete({
        goalId: new Types.ObjectId(goalId),
        userId: new Types.ObjectId(userId),
      })
      .exec();
    if (!result) {
      throw new NotFoundException(`Member not found in goal`);
    }
  }

  // ─── Leaderboard ────────────────────────────────────────

  async getLeaderboard(goalId: string): Promise<any[]> {
    // Aggregate total study time per user for this goal
    return this.goalMemberModel.aggregate([
      { $match: { goalId: new Types.ObjectId(goalId) } },
      {
        $lookup: {
          from: 'study_sessions',
          let: { uId: '$userId', gId: '$goalId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$userId', '$$uId'] },
                    { $eq: ['$goalId', '$$gId'] },
                  ],
                },
              },
            },
          ],
          as: 'sessions',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$user._id',
          name: '$user.name',
          email: '$user.email',
          avatar: '$user.avatar',
          totalSeconds: { $sum: '$sessions.durationSeconds' },
          sessionCount: { $size: '$sessions' },
        },
      },
      { $sort: { totalSeconds: -1 } },
    ]);
  }
}
