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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
let UsersService = class UsersService {
    static { UsersService_1 = this; }
    userModel;
    static ONLINE_THRESHOLD_MS = 60_000;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(createUserDto) {
        const user = new this.userModel(createUserDto);
        return user.save();
    }
    async findAll() {
        return this.userModel.find().sort({ createdAt: -1 }).exec();
    }
    async findById(id) {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new common_1.NotFoundException(`User with ID "${id}" not found`);
        }
        return user;
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async update(id, updateUserDto) {
        const user = await this.userModel
            .findByIdAndUpdate(id, { $set: updateUserDto }, { new: true, runValidators: true })
            .exec();
        if (!user) {
            throw new common_1.NotFoundException(`User with ID "${id}" not found`);
        }
        return user;
    }
    async remove(id) {
        const result = await this.userModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`User with ID "${id}" not found`);
        }
    }
    async heartbeat(id) {
        const user = await this.userModel
            .findByIdAndUpdate(id, { $set: { lastSeenAt: new Date() } }, { new: true })
            .exec();
        if (!user) {
            throw new common_1.NotFoundException(`User with ID "${id}" not found`);
        }
        return user;
    }
    isOnline(user) {
        if (!user.lastSeenAt)
            return false;
        return Date.now() - new Date(user.lastSeenAt).getTime() < UsersService_1.ONLINE_THRESHOLD_MS;
    }
    async getOnlineUserIds() {
        const threshold = new Date(Date.now() - UsersService_1.ONLINE_THRESHOLD_MS);
        const users = await this.userModel
            .find({ lastSeenAt: { $gte: threshold } }, { _id: 1 })
            .exec();
        return users.map((u) => u._id.toString());
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map