import { Model } from 'mongoose';
import { StudySession } from './schemas/study-session.schema';
import { CreateStudySessionDto } from './dto/create-study-session.dto';
import { QueryStudySessionDto } from './dto/query-study-session.dto';
import { StreaksService } from '../streaks/streaks.service';
export declare class StudySessionsService {
    private readonly sessionModel;
    private readonly streaksService;
    constructor(sessionModel: Model<StudySession>, streaksService: StreaksService);
    create(dto: CreateStudySessionDto): Promise<StudySession>;
    findAll(query: QueryStudySessionDto): Promise<StudySession[]>;
    findById(id: string): Promise<StudySession>;
    remove(id: string): Promise<void>;
    getUserGoalStats(userId: string, goalId: string): Promise<any>;
}
