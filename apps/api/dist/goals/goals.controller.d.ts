import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { AddMemberDto } from './dto/add-member.dto';
export declare class GoalsController {
    private readonly goalsService;
    constructor(goalsService: GoalsService);
    create(createGoalDto: CreateGoalDto): Promise<import("./schemas/goal.schema").Goal>;
    findAll(userId?: string): Promise<import("./schemas/goal.schema").Goal[]>;
    findOne(id: string): Promise<import("./schemas/goal.schema").Goal>;
    update(id: string, updateGoalDto: UpdateGoalDto): Promise<import("./schemas/goal.schema").Goal>;
    remove(id: string): Promise<void>;
    addMember(id: string, addMemberDto: AddMemberDto): Promise<import("./schemas/goal-member.schema").GoalMember>;
    getMembers(id: string): Promise<import("./schemas/goal-member.schema").GoalMember[]>;
    removeMember(id: string, userId: string): Promise<void>;
    getLeaderboard(id: string): Promise<any[]>;
}
