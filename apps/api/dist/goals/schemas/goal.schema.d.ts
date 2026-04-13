import { Document, Types } from 'mongoose';
export declare class Goal extends Document {
    title: string;
    description?: string;
    settings: {
        virtualRoomUrl?: string;
    };
    adminId: Types.ObjectId;
}
export declare const GoalSchema: import("mongoose").Schema<Goal, import("mongoose").Model<Goal, any, any, any, Document<unknown, any, Goal, any, {}> & Goal & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Goal, Document<unknown, {}, import("mongoose").FlatRecord<Goal>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Goal> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
