"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const goal_schema_1 = require("./schemas/goal.schema");
const goal_member_schema_1 = require("./schemas/goal-member.schema");
const shared_1 = require("@mindflow/shared");
let GoalsService = class GoalsService {
    goalModel;
    goalMemberModel;
    constructor(goalModel, goalMemberModel) {
        this.goalModel = goalModel;
        this.goalMemberModel = goalMemberModel;
    }
    async create(createGoalDto) {
        const goal = await new this.goalModel(createGoalDto).save();
        await new this.goalMemberModel({
            userId: new mongoose_2.Types.ObjectId(createGoalDto.adminId),
            goalId: goal._id,
            role: shared_1.GoalRole.ADMIN,
        }).save();
        return goal;
    }
    async findAll(userId) {
        if (userId) {
            const memberships = await this.goalMemberModel
                .find({ userId: new mongoose_2.Types.ObjectId(userId) })
                .exec();
            const goalIds = memberships.map((m) => m.goalId);
            return this.goalModel.find({ _id: { $in: goalIds } }).sort({ createdAt: -1 }).exec();
        }
        return this.goalModel.find().sort({ createdAt: -1 }).exec();
    }
    async findById(id) {
        const goal = await this.goalModel.findById(id).populate('adminId', 'name email avatar').exec();
        if (!goal) {
            throw new common_1.NotFoundException(`Goal with ID "${id}" not found`);
        }
        return goal;
    }
    async update(id, updateGoalDto) {
        const goal = await this.goalModel
            .findByIdAndUpdate(id, { $set: updateGoalDto }, { new: true, runValidators: true })
            .exec();
        if (!goal) {
            throw new common_1.NotFoundException(`Goal with ID "${id}" not found`);
        }
        return goal;
    }
    async remove(id) {
        const goal = await this.goalModel.findByIdAndDelete(id).exec();
        if (!goal) {
            throw new common_1.NotFoundException(`Goal with ID "${id}" not found`);
        }
        await this.goalMemberModel.deleteMany({ goalId: goal._id }).exec();
    }
    async addMember(goalId, addMemberDto) {
        const goal = await this.goalModel.findById(goalId).exec();
        if (!goal) {
            throw new common_1.NotFoundException(`Goal with ID "${goalId}" not found`);
        }
        const member = new this.goalMemberModel({
            goalId: new mongoose_2.Types.ObjectId(goalId),
            userId: new mongoose_2.Types.ObjectId(addMemberDto.userId),
            role: addMemberDto.role || shared_1.GoalRole.USER,
        });
        return member.save();
    }
    async getMembers(goalId) {
        return this.goalMemberModel
            .find({ goalId: new mongoose_2.Types.ObjectId(goalId) })
            .populate('userId', 'name email avatar lastSeenAt')
            .sort({ createdAt: 1 })
            .exec();
    }
    async removeMember(goalId, userId) {
        const result = await this.goalMemberModel
            .findOneAndDelete({
            goalId: new mongoose_2.Types.ObjectId(goalId),
            userId: new mongoose_2.Types.ObjectId(userId),
        })
            .exec();
        if (!result) {
            throw new common_1.NotFoundException(`Member not found in goal`);
        }
    }
    async getLeaderboard(goalId) {
        return this.goalMemberModel.aggregate([
            { $match: { goalId: new mongoose_2.Types.ObjectId(goalId) } },
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
};
exports.GoalsService = GoalsService;
exports.GoalsService = GoalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(goal_schema_1.Goal.name)),
    __param(1, (0, mongoose_1.InjectModel)(goal_member_schema_1.GoalMember.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], GoalsService);
//# sourceMappingURL=goals.service.js.map