import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'topics' })
export class Topic extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true, default: '' })
  description: string;

  @Prop({ type: Number, default: 0 })
  order: number;

  @Prop({ type: Types.ObjectId, ref: 'Chapter', required: true, index: true })
  chapterId: Types.ObjectId;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
