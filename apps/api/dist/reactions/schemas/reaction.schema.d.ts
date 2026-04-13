import { Document, Types } from 'mongoose';
export declare class Reaction extends Document {
    type: string;
    chapterId: Types.ObjectId;
    giverId: Types.ObjectId;
    receiverId: Types.ObjectId;
}
export declare const ReactionSchema: import("mongoose").Schema<Reaction, import("mongoose").Model<Reaction, any, any, any, Document<unknown, any, Reaction, any, {}> & Reaction & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Reaction, Document<unknown, {}, import("mongoose").FlatRecord<Reaction>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Reaction> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
