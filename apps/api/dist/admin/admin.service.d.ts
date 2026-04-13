import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { Goal } from '../goals/schemas/goal.schema';
import { GoalMember } from '../goals/schemas/goal-member.schema';
import { StudySession } from '../study-sessions/schemas/study-session.schema';
import { Chapter } from '../chapters/schemas/chapter.schema';
import { Reaction } from '../reactions/schemas/reaction.schema';
export declare class AdminService {
    private readonly userModel;
    private readonly goalModel;
    private readonly goalMemberModel;
    private readonly sessionModel;
    private readonly chapterModel;
    private readonly reactionModel;
    private static readonly ONLINE_THRESHOLD_MS;
    constructor(userModel: Model<User>, goalModel: Model<Goal>, goalMemberModel: Model<GoalMember>, sessionModel: Model<StudySession>, chapterModel: Model<Chapter>, reactionModel: Model<Reaction>);
    getStats(): Promise<Record<string, number>>;
    getAllUsers(): Promise<Record<string, any>[]>;
    getAllGoals(): Promise<Record<string, any>[]>;
    getRecentActivity(limit?: number): Promise<Record<string, any>[]>;
}
