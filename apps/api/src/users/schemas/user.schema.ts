import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SystemRole } from '@mindflow/shared';

@Schema({ timestamps: true, collection: 'users' })
export class User extends Document {
  @Prop({ required: true, unique: true, index: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: String, default: null })
  avatar: string | null;

  @Prop({ type: String, enum: SystemRole, default: SystemRole.USER, index: true })
  role: SystemRole;

  @Prop({ type: Date, default: null })
  lastSeenAt: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
