import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { StudySession } from '../study-sessions/schemas/study-session.schema';
import { TopicProgress } from '../topic-progress/schemas/topic-progress.schema';
import { Reaction } from '../reactions/schemas/reaction.schema';
import { Streak } from '../streaks/schemas/streak.schema';
export declare class UsersService {
    private readonly userModel;
    private readonly studySessionModel;
    private readonly topicProgressModel;
    private readonly reactionModel;
    private readonly streakModel;
    private static readonly ONLINE_THRESHOLD_MS;
    constructor(userModel: Model<User>, studySessionModel: Model<StudySession>, topicProgressModel: Model<TopicProgress>, reactionModel: Model<Reaction>, streakModel: Model<Streak>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findOrCreateByEmail(email: string, name: string, avatar?: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
    heartbeat(id: string): Promise<User>;
    isOnline(user: User): boolean;
    getOnlineUserIds(): Promise<string[]>;
    getUserStats(userId: string): Promise<any>;
}
