import { Document, Types } from 'mongoose';
import { GoalRole } from '@mindflow/shared';
export declare class GoalMember extends Document {
    role: GoalRole;
    userId: Types.ObjectId;
    goalId: Types.ObjectId;
}
export declare const GoalMemberSchema: import("mongoose").Schema<GoalMember, import("mongoose").Model<GoalMember, any, any, any, Document<unknown, any, GoalMember, any, {}> & GoalMember & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, GoalMember, Document<unknown, {}, import("mongoose").FlatRecord<GoalMember>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<GoalMember> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
