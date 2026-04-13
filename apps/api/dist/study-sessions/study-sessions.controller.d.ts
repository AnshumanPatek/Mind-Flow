import { StudySessionsService } from './study-sessions.service';
import { CreateStudySessionDto } from './dto/create-study-session.dto';
import { QueryStudySessionDto } from './dto/query-study-session.dto';
export declare class StudySessionsController {
    private readonly studySessionsService;
    constructor(studySessionsService: StudySessionsService);
    create(createDto: CreateStudySessionDto): Promise<import("./schemas/study-session.schema").StudySession>;
    findAll(query: QueryStudySessionDto): Promise<import("./schemas/study-session.schema").StudySession[]>;
    findOne(id: string): Promise<import("./schemas/study-session.schema").StudySession>;
    remove(id: string): Promise<void>;
}
