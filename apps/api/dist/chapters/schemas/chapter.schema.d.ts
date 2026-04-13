import { Document, Types } from 'mongoose';
import { ChapterStatus } from '@mindflow/shared';
export declare class Chapter extends Document {
    title: string;
    status: ChapterStatus;
    order: number;
    topicId: Types.ObjectId;
}
export declare const ChapterSchema: import("mongoose").Schema<Chapter, import("mongoose").Model<Chapter, any, any, any, Document<unknown, any, Chapter, any, {}> & Chapter & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Chapter, Document<unknown, {}, import("mongoose").FlatRecord<Chapter>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Chapter> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
