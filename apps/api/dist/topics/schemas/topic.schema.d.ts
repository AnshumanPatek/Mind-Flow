import { Document, Types } from 'mongoose';
export declare class Topic extends Document {
    title: string;
    description: string;
    order: number;
    chapterId: Types.ObjectId;
}
export declare const TopicSchema: import("mongoose").Schema<Topic, import("mongoose").Model<Topic, any, any, any, Document<unknown, any, Topic, any, {}> & Topic & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Topic, Document<unknown, {}, import("mongoose").FlatRecord<Topic>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Topic> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
