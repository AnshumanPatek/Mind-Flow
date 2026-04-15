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
exports.TopicsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const topic_schema_1 = require("./schemas/topic.schema");
let TopicsService = class TopicsService {
    topicModel;
    constructor(topicModel) {
        this.topicModel = topicModel;
    }
    async create(createTopicDto) {
        const topic = new this.topicModel({
            ...createTopicDto,
            chapterId: new mongoose_2.Types.ObjectId(createTopicDto.chapterId),
        });
        return topic.save();
    }
    async findByChapter(chapterId) {
        return this.topicModel
            .find({ chapterId: new mongoose_2.Types.ObjectId(chapterId) })
            .sort({ order: 1, createdAt: 1 })
            .exec();
    }
    async findById(id) {
        const topic = await this.topicModel.findById(id).exec();
        if (!topic) {
            throw new common_1.NotFoundException(`Topic with ID "${id}" not found`);
        }
        return topic;
    }
    async update(id, updateTopicDto) {
        const topic = await this.topicModel
            .findByIdAndUpdate(id, { $set: updateTopicDto }, { new: true, runValidators: true })
            .exec();
        if (!topic) {
            throw new common_1.NotFoundException(`Topic with ID "${id}" not found`);
        }
        return topic;
    }
    async remove(id) {
        const topic = await this.topicModel.findByIdAndDelete(id).exec();
        if (!topic) {
            throw new common_1.NotFoundException(`Topic with ID "${id}" not found`);
        }
    }
    async removeByGoal(goalId) {
        await this.topicModel.deleteMany({ goalId: new mongoose_2.Types.ObjectId(goalId) }).exec();
    }
    async removeByChapter(chapterId) {
        await this.topicModel.deleteMany({ chapterId: new mongoose_2.Types.ObjectId(chapterId) }).exec();
    }
};
exports.TopicsService = TopicsService;
exports.TopicsService = TopicsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(topic_schema_1.Topic.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TopicsService);
//# sourceMappingURL=topics.service.js.map