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
exports.ReactionSchema = exports.Reaction = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Reaction = class Reaction extends mongoose_2.Document {
    type;
    chapterId;
    giverId;
    receiverId;
};
exports.Reaction = Reaction;
__decorate([
    (0, mongoose_1.Prop)({ default: '🔥', trim: true }),
    __metadata("design:type", String)
], Reaction.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Chapter', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Reaction.prototype, "chapterId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Reaction.prototype, "giverId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Reaction.prototype, "receiverId", void 0);
exports.Reaction = Reaction = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'reactions' })
], Reaction);
exports.ReactionSchema = mongoose_1.SchemaFactory.createForClass(Reaction);
exports.ReactionSchema.index({ giverId: 1, chapterId: 1 }, { unique: true });
//# sourceMappingURL=reaction.schema.js.map