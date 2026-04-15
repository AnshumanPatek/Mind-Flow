import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'streaks' })
export class Streak extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  currentStreak: number;

  @Prop({ type: Number, default: 0 })
  longestStreak: number;

  @Prop({ type: Date })
  lastStudyDate?: Date;

  @Prop({ type: [Date], default: [] })
  studyDates: Date[];
}

export const StreakSchema = SchemaFactory.createForClass(Streak);
