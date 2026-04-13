import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ChapterStatus } from '@mindflow/shared';

@Schema({ timestamps: true, collection: 'chapters' })
export class Chapter extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ type: String, enum: ChapterStatus, default: ChapterStatus.PENDING, index: true })
  status: ChapterStatus;

  @Prop({ type: Number, default: 0 })
  order: number;

  @Prop({ type: Types.ObjectId, ref: 'Topic', required: true, index: true })
  topicId: Types.ObjectId;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
