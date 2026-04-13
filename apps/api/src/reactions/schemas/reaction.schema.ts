import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'reactions' })
export class Reaction extends Document {
  @Prop({ default: '🔥', trim: true })
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'Chapter', required: true, index: true })
  chapterId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  giverId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  receiverId: Types.ObjectId;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
// One reaction per user per chapter
ReactionSchema.index({ giverId: 1, chapterId: 1 }, { unique: true });
