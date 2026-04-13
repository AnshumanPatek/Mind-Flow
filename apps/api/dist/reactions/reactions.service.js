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
exports.ReactionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const reaction_schema_1 = require("./schemas/reaction.schema");
let ReactionsService = class ReactionsService {
    reactionModel;
    constructor(reactionModel) {
        this.reactionModel = reactionModel;
    }
    async create(dto) {
        try {
            const reaction = new this.reactionModel({
                type: dto.type || '🔥',
                chapterId: new mongoose_2.Types.ObjectId(dto.chapterId),
                giverId: new mongoose_2.Types.ObjectId(dto.giverId),
                receiverId: new mongoose_2.Types.ObjectId(dto.receiverId),
            });
            return await reaction.save();
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.ConflictException('You have already reacted to this chapter');
            }
            throw error;
        }
    }
    async findByChapter(chapterId) {
        return this.reactionModel
            .find({ chapterId: new mongoose_2.Types.ObjectId(chapterId) })
            .populate('giverId', 'name email avatar')
            .populate('receiverId', 'name email avatar')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findByReceiver(receiverId) {
        return this.reactionModel
            .find({ receiverId: new mongoose_2.Types.ObjectId(receiverId) })
            .populate('giverId', 'name email avatar')
            .populate('chapterId', 'title status')
            .sort({ createdAt: -1 })
            .exec();
    }
    async remove(id) {
        const result = await this.reactionModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Reaction with ID "${id}" not found`);
        }
    }
    async countByReceiver(receiverId) {
        return this.reactionModel
            .countDocuments({ receiverId: new mongoose_2.Types.ObjectId(receiverId) })
            .exec();
    }
};
exports.ReactionsService = ReactionsService;
exports.ReactionsService = ReactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(reaction_schema_1.Reaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ReactionsService);
//# sourceMappingURL=reactions.service.js.map