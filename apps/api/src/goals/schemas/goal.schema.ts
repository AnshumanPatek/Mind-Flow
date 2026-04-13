import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'goals' })
export class Goal extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: { virtualRoomUrl: String }, default: {} })
  settings: {
    virtualRoomUrl?: string; 
  };

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  adminId: Types.ObjectId; 
}

export const GoalSchema = SchemaFactory.createForClass(Goal);
