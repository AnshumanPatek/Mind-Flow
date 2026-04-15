import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'topic_progress' })
export class TopicProgress extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Topic', required: true, index: true })
  topicId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Goal', required: true, index: true })
  goalId: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isCompleted: boolean;

  @Prop({ type: Date })
  completedAt?: Date;
}

export const TopicProgressSchema = SchemaFactory.createForClass(TopicProgress);

// Compound index for efficient queries
TopicProgressSchema.index({ topicId: 1, userId: 1, goalId: 1 }, { unique: true });
