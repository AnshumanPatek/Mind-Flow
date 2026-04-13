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
exports.ChaptersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chapter_schema_1 = require("./schemas/chapter.schema");
let ChaptersService = class ChaptersService {
    chapterModel;
    constructor(chapterModel) {
        this.chapterModel = chapterModel;
    }
    async create(createChapterDto) {
        const chapter = new this.chapterModel({
            ...createChapterDto,
            topicId: new mongoose_2.Types.ObjectId(createChapterDto.topicId),
        });
        return chapter.save();
    }
    async findByTopic(topicId) {
        return this.chapterModel
            .find({ topicId: new mongoose_2.Types.ObjectId(topicId) })
            .sort({ order: 1, createdAt: 1 })
            .exec();
    }
    async findById(id) {
        const chapter = await this.chapterModel.findById(id).exec();
        if (!chapter) {
            throw new common_1.NotFoundException(`Chapter with ID "${id}" not found`);
        }
        return chapter;
    }
    async update(id, updateChapterDto) {
        const chapter = await this.chapterModel
            .findByIdAndUpdate(id, { $set: updateChapterDto }, { new: true, runValidators: true })
            .exec();
        if (!chapter) {
            throw new common_1.NotFoundException(`Chapter with ID "${id}" not found`);
        }
        return chapter;
    }
    async remove(id) {
        const chapter = await this.chapterModel.findByIdAndDelete(id).exec();
        if (!chapter) {
            throw new common_1.NotFoundException(`Chapter with ID "${id}" not found`);
        }
    }
    async removeByTopic(topicId) {
        await this.chapterModel.deleteMany({ topicId: new mongoose_2.Types.ObjectId(topicId) }).exec();
    }
};
exports.ChaptersService = ChaptersService;
exports.ChaptersService = ChaptersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chapter_schema_1.Chapter.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ChaptersService);
//# sourceMappingURL=chapters.service.js.map