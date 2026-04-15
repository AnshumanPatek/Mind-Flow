import { Document, Types } from 'mongoose';
export declare class StudySession extends Document {
    durationSeconds: number;
    startedAt: Date;
    userId: Types.ObjectId;
    goalId?: Types.ObjectId;
    chapterId?: Types.ObjectId;
}
export declare const StudySessionSchema: import("mongoose").Schema<StudySession, import("mongoose").Model<StudySession, any, any, any, Document<unknown, any, StudySession, any, {}> & StudySession & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, StudySession, Document<unknown, {}, import("mongoose").FlatRecord<StudySession>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<StudySession> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
