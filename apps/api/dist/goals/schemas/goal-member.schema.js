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
exports.GoalMemberSchema = exports.GoalMember = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@mindflow/shared");
let GoalMember = class GoalMember extends mongoose_2.Document {
    role;
    userId;
    goalId;
};
exports.GoalMember = GoalMember;
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: shared_1.GoalRole, default: shared_1.GoalRole.USER, index: true }),
    __metadata("design:type", String)
], GoalMember.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], GoalMember.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Goal', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], GoalMember.prototype, "goalId", void 0);
exports.GoalMember = GoalMember = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'goal_members' })
], GoalMember);
exports.GoalMemberSchema = mongoose_1.SchemaFactory.createForClass(GoalMember);
exports.GoalMemberSchema.index({ userId: 1, goalId: 1 }, { unique: true });
//# sourceMappingURL=goal-member.schema.js.map