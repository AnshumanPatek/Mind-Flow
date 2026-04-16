"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const goals_module_1 = require("./goals/goals.module");
const sections_module_1 = require("./sections/sections.module");
const topics_module_1 = require("./topics/topics.module");
const chapters_module_1 = require("./chapters/chapters.module");
const study_sessions_module_1 = require("./study-sessions/study-sessions.module");
const reactions_module_1 = require("./reactions/reactions.module");
const admin_module_1 = require("./admin/admin.module");
const topic_progress_module_1 = require("./topic-progress/topic-progress.module");
const streaks_module_1 = require("./streaks/streaks.module");
const doubts_module_1 = require("./doubts/doubts.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    uri: configService.get('MONGODB_URI', 'mongodb://localhost:27017/mindflow'),
                }),
            }),
            users_module_1.UsersModule,
            goals_module_1.GoalsModule,
            sections_module_1.SectionsModule,
            topics_module_1.TopicsModule,
            chapters_module_1.ChaptersModule,
            study_sessions_module_1.StudySessionsModule,
            reactions_module_1.ReactionsModule,
            admin_module_1.AdminModule,
            topic_progress_module_1.TopicProgressModule,
            streaks_module_1.StreaksModule,
            doubts_module_1.DoubtsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map