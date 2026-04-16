"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./schemas/user.schema");
const users_controller_1 = require("./users.controller");
const users_service_1 = require("./users.service");
const study_session_schema_1 = require("../study-sessions/schemas/study-session.schema");
const topic_progress_schema_1 = require("../topic-progress/schemas/topic-progress.schema");
const reaction_schema_1 = require("../reactions/schemas/reaction.schema");
const streak_schema_1 = require("../streaks/schemas/streak.schema");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: study_session_schema_1.StudySession.name, schema: study_session_schema_1.StudySessionSchema },
                { name: topic_progress_schema_1.TopicProgress.name, schema: topic_progress_schema_1.TopicProgressSchema },
                { name: reaction_schema_1.Reaction.name, schema: reaction_schema_1.ReactionSchema },
                { name: streak_schema_1.Streak.name, schema: streak_schema_1.StreakSchema },
            ]),
        ],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map