import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { GoalRole } from '@mindflow/shared';

@Schema({ timestamps: true, collection: 'goal_members' })
export class GoalMember extends Document {
  @Prop({ type: String, enum: GoalRole, default: GoalRole.USER, index: true })
  role: GoalRole;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Goal', required: true, index: true })
  goalId: Types.ObjectId;
}

export const GoalMemberSchema = SchemaFactory.createForClass(GoalMember);
GoalMemberSchema.index({ userId: 1, goalId: 1 }, { unique: true });
