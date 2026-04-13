import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'study_sessions' })
export class StudySession extends Document {
  @Prop({ required: true, min: 1 })
  durationSeconds: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Goal', required: true, index: true })
  goalId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Chapter', required: false, index: true })
  chapterId?: Types.ObjectId;
}

export const StudySessionSchema = SchemaFactory.createForClass(StudySession);
