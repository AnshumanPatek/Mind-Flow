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
exports.StudySessionsController = void 0;
const common_1 = require("@nestjs/common");
const study_sessions_service_1 = require("./study-sessions.service");
const create_study_session_dto_1 = require("./dto/create-study-session.dto");
const query_study_session_dto_1 = require("./dto/query-study-session.dto");
let StudySessionsController = class StudySessionsController {
    studySessionsService;
    constructor(studySessionsService) {
        this.studySessionsService = studySessionsService;
    }
    create(createDto) {
        return this.studySessionsService.create(createDto);
    }
    findAll(query) {
        return this.studySessionsService.findAll(query);
    }
    findOne(id) {
        return this.studySessionsService.findById(id);
    }
    remove(id) {
        return this.studySessionsService.remove(id);
    }
};
exports.StudySessionsController = StudySessionsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_study_session_dto_1.CreateStudySessionDto]),
    __metadata("design:returntype", void 0)
], StudySessionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_study_session_dto_1.QueryStudySessionDto]),
    __metadata("design:returntype", void 0)
], StudySessionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudySessionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudySessionsController.prototype, "remove", null);
exports.StudySessionsController = StudySessionsController = __decorate([
    (0, common_1.Controller)('study-sessions'),
    __metadata("design:paramtypes", [study_sessions_service_1.StudySessionsService])
], StudySessionsController);
//# sourceMappingURL=study-sessions.controller.js.map