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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudySessionSchema = exports.StudySession = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let StudySession = class StudySession extends mongoose_2.Document {
    durationSeconds;
    startedAt;
    userId;
    goalId;
    chapterId;
};
exports.StudySession = StudySession;
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], StudySession.prototype, "durationSeconds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], StudySession.prototype, "startedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StudySession.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Goal', required: false, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StudySession.prototype, "goalId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Chapter', required: false, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StudySession.prototype, "chapterId", void 0);
exports.StudySession = StudySession = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'study_sessions' })
], StudySession);
exports.StudySessionSchema = mongoose_1.SchemaFactory.createForClass(StudySession);
//# sourceMappingURL=study-session.schema.js.map