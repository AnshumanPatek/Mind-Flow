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
exports.StudySessionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const study_session_schema_1 = require("./schemas/study-session.schema");
const streaks_service_1 = require("../streaks/streaks.service");
let StudySessionsService = class StudySessionsService {
    sessionModel;
    streaksService;
    constructor(sessionModel, streaksService) {
        this.sessionModel = sessionModel;
        this.streaksService = streaksService;
    }
    async create(dto) {
        const session = new this.sessionModel({
            durationSeconds: dto.durationSeconds,
            startedAt: new Date(dto.startedAt),
            userId: new mongoose_2.Types.ObjectId(dto.userId),
            ...(dto.goalId && { goalId: new mongoose_2.Types.ObjectId(dto.goalId) }),
            ...(dto.chapterId && { chapterId: new mongoose_2.Types.ObjectId(dto.chapterId) }),
        });
        const savedSession = await session.save();
        try {
            await this.streaksService.updateStreak(dto.userId);
        }
        catch (error) {
            console.error('Failed to update streak:', error);
        }
        return savedSession;
    }
    async findAll(query) {
        const filter = {};
        if (query.userId)
            filter.userId = new mongoose_2.Types.ObjectId(query.userId);
        if (query.goalId)
            filter.goalId = new mongoose_2.Types.ObjectId(query.goalId);
        if (query.chapterId)
            filter.chapterId = new mongoose_2.Types.ObjectId(query.chapterId);
        return this.sessionModel
            .find(filter)
            .populate('userId', 'name email avatar')
            .populate('goalId', 'title')
            .populate('chapterId', 'title')
            .sort({ startedAt: -1 })
            .exec();
    }
    async findById(id) {
        const session = await this.sessionModel
            .findById(id)
            .populate('userId', 'name email avatar')
            .populate('goalId', 'title')
            .populate('chapterId', 'title')
            .exec();
        if (!session) {
            throw new common_1.NotFoundException(`Study session with ID "${id}" not found`);
        }
        return session;
    }
    async remove(id) {
        const result = await this.sessionModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Study session with ID "${id}" not found`);
        }
    }
    async getUserGoalStats(userId, goalId) {
        const result = await this.sessionModel.aggregate([
            {
                $match: {
                    userId: new mongoose_2.Types.ObjectId(userId),
                    goalId: new mongoose_2.Types.ObjectId(goalId),
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
};
exports.StudySessionsService = StudySessionsService;
exports.StudySessionsService = StudySessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(study_session_schema_1.StudySession.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        streaks_service_1.StreaksService])
], StudySessionsService);
//# sourceMappingURL=study-sessions.service.js.map