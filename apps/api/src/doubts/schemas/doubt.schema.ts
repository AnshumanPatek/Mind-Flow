import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DoubtDocument = Doubt & Document;

@Schema({ timestamps: true })
export class Doubt {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Goal', required: true })
  goalId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ default: 'open', enum: ['open', 'resolved'] })
  status: string;

  @Prop({
    type: [
      {
        userId: { type: Types.ObjectId, ref: 'User', required: true },
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  replies: Array<{
    userId: Types.ObjectId;
    message: string;
    createdAt: Date;
  }>;
}

export const DoubtSchema = SchemaFactory.createForClass(Doubt);
