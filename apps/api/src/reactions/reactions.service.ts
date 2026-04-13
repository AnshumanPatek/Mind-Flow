import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reaction } from './schemas/reaction.schema';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectModel(Reaction.name) private readonly reactionModel: Model<Reaction>,
  ) {}

  async create(dto: CreateReactionDto): Promise<Reaction> {
    try {
      const reaction = new this.reactionModel({
        type: dto.type || '🔥',
        chapterId: new Types.ObjectId(dto.chapterId),
        giverId: new Types.ObjectId(dto.giverId),
        receiverId: new Types.ObjectId(dto.receiverId),
      });
      return await reaction.save();
    } catch (error: any) {
      // Handle duplicate key error (one reaction per user per chapter)
      if (error.code === 11000) {
        throw new ConflictException('You have already reacted to this chapter');
      }
      throw error;
    }
  }

  async findByChapter(chapterId: string): Promise<Reaction[]> {
    return this.reactionModel
      .find({ chapterId: new Types.ObjectId(chapterId) })
      .populate('giverId', 'name email avatar')
      .populate('receiverId', 'name email avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByReceiver(receiverId: string): Promise<Reaction[]> {
    return this.reactionModel
      .find({ receiverId: new Types.ObjectId(receiverId) })
      .populate('giverId', 'name email avatar')
      .populate('chapterId', 'title status')
      .sort({ createdAt: -1 })
      .exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.reactionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Reaction with ID "${id}" not found`);
    }
  }

  /**
   * Count total reactions received by a user.
   */
  async countByReceiver(receiverId: string): Promise<number> {
    return this.reactionModel
      .countDocuments({ receiverId: new Types.ObjectId(receiverId) })
      .exec();
  }
}
