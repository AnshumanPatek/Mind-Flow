import { Model } from 'mongoose';
import { Goal } from './schemas/goal.schema';
import { GoalMember } from './schemas/goal-member.schema';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { AddMemberDto } from './dto/add-member.dto';
export declare class GoalsService {
    private readonly goalModel;
    private readonly goalMemberModel;
    constructor(goalModel: Model<Goal>, goalMemberModel: Model<GoalMember>);
    create(createGoalDto: CreateGoalDto): Promise<Goal>;
    findAll(userId?: string): Promise<Goal[]>;
    findById(id: string): Promise<Goal>;
    update(id: string, updateGoalDto: UpdateGoalDto): Promise<Goal>;
    remove(id: string): Promise<void>;
    addMember(goalId: string, addMemberDto: AddMemberDto): Promise<GoalMember>;
    getMembers(goalId: string): Promise<GoalMember[]>;
    removeMember(goalId: string, userId: string): Promise<void>;
    getLeaderboard(goalId: string): Promise<any[]>;
}
