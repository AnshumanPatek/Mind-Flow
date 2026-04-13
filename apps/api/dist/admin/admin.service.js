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
var AdminService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const goal_schema_1 = require("../goals/schemas/goal.schema");
const goal_member_schema_1 = require("../goals/schemas/goal-member.schema");
const study_session_schema_1 = require("../study-sessions/schemas/study-session.schema");
const chapter_schema_1 = require("../chapters/schemas/chapter.schema");
const reaction_schema_1 = require("../reactions/schemas/reaction.schema");
let AdminService = class AdminService {
    static { AdminService_1 = this; }
    userModel;
    goalModel;
    goalMemberModel;
    sessionModel;
    chapterModel;
    reactionModel;
    static ONLINE_THRESHOLD_MS = 60_000;
    constructor(userModel, goalModel, goalMemberModel, sessionModel, chapterModel, reactionModel) {
        this.userModel = userModel;
        this.goalModel = goalModel;
        this.goalMemberModel = goalMemberModel;
        this.sessionModel = sessionModel;
        this.chapterModel = chapterModel;
        this.reactionModel = reactionModel;
    }
    async getStats() {
        const onlineThreshold = new Date(Date.now() - AdminService_1.ONLINE_THRESHOLD_MS);
        const [totalUsers, totalGoals, totalSessions, totalChapters, totalReactions, activeUsers] = await Promise.all([
            this.userModel.countDocuments().exec(),
            this.goalModel.countDocuments().exec(),
            this.sessionModel.countDocuments().exec(),
            this.chapterModel.countDocuments().exec(),
            this.reactionModel.countDocuments().exec(),
            this.userModel.countDocuments({ lastSeenAt: { $gte: onlineThreshold } }).exec(),
        ]);
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
    async getAllUsers() {
        const users = await this.userModel.find().sort({ createdAt: -1 }).lean().exec();
        const usersWithStats = await Promise.all(users.map(async (user) => {
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
                isOnline: user.lastSeenAt != null &&
                    Date.now() - new Date(user.lastSeenAt).getTime() < AdminService_1.ONLINE_THRESHOLD_MS,
                goalCount,
                totalStudySeconds: stats.totalSeconds,
                sessionCount: stats.sessionCount,
                reactionsReceived: reactionCount,
            };
        }));
        return usersWithStats;
    }
    async getAllGoals() {
        const goals = await this.goalModel
            .find()
            .populate('adminId', 'name email avatar')
            .sort({ createdAt: -1 })
            .lean()
            .exec();
        const goalsWithStats = await Promise.all(goals.map(async (goal) => {
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
                progressPercent: totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0,
                totalStudySeconds: sessionStats.totalSeconds,
                sessionCount: sessionStats.sessionCount,
            };
        }));
        return goalsWithStats;
    }
    async getRecentActivity(limit = 20) {
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
        const activity = [
            ...recentSessions.map((s) => ({
                type: 'study_session',
                data: s,
                createdAt: s.createdAt,
            })),
            ...recentReactions.map((r) => ({
                type: 'reaction',
                data: r,
                createdAt: r.createdAt,
            })),
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return activity.slice(0, limit);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = AdminService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(goal_schema_1.Goal.name)),
    __param(2, (0, mongoose_1.InjectModel)(goal_member_schema_1.GoalMember.name)),
    __param(3, (0, mongoose_1.InjectModel)(study_session_schema_1.StudySession.name)),
    __param(4, (0, mongoose_1.InjectModel)(chapter_schema_1.Chapter.name)),
    __param(5, (0, mongoose_1.InjectModel)(reaction_schema_1.Reaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AdminService);
//# sourceMappingURL=admin.service.js.map