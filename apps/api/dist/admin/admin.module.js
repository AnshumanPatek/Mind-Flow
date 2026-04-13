"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const goal_schema_1 = require("../goals/schemas/goal.schema");
const goal_member_schema_1 = require("../goals/schemas/goal-member.schema");
const study_session_schema_1 = require("../study-sessions/schemas/study-session.schema");
const chapter_schema_1 = require("../chapters/schemas/chapter.schema");
const reaction_schema_1 = require("../reactions/schemas/reaction.schema");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: goal_schema_1.Goal.name, schema: goal_schema_1.GoalSchema },
                { name: goal_member_schema_1.GoalMember.name, schema: goal_member_schema_1.GoalMemberSchema },
                { name: study_session_schema_1.StudySession.name, schema: study_session_schema_1.StudySessionSchema },
                { name: chapter_schema_1.Chapter.name, schema: chapter_schema_1.ChapterSchema },
                { name: reaction_schema_1.Reaction.name, schema: reaction_schema_1.ReactionSchema },
            ]),
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map