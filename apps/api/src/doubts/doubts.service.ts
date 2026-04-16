import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Doubt } from './schemas/doubt.schema';
import { CreateDoubtDto } from './dto/create-doubt.dto';
import { AddReplyDto } from './dto/add-reply.dto';

@Injectable()
export class DoubtsService {
  constructor(
    @InjectModel(Doubt.name) private readonly doubtModel: Model<Doubt>,
  ) {}

  async create(createDoubtDto: CreateDoubtDto): Promise<Doubt> {
    const doubt = new this.doubtModel({
      ...createDoubtDto,
      goalId: new Types.ObjectId(createDoubtDto.goalId),
      userId: new Types.ObjectId(createDoubtDto.userId),
    });
    return doubt.save();
  }

  async findByGoal(goalId: string): Promise<Doubt[]> {
    return this.doubtModel
      .find({ goalId: new Types.ObjectId(goalId) })
      .populate('userId', 'name email avatar')
      .populate('replies.userId', 'name email avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Doubt> {
    const doubt = await this.doubtModel
      .findById(id)
      .populate('userId', 'name email avatar')
      .populate('replies.userId', 'name email avatar')
      .exec();
    if (!doubt) {
      throw new NotFoundException(`Doubt with ID "${id}" not found`);
    }
    return doubt;
  }

  async addReply(id: string, addReplyDto: AddReplyDto): Promise<Doubt> {
    const doubt = await this.doubtModel.findById(id);
    if (!doubt) {
      throw new NotFoundException(`Doubt with ID "${id}" not found`);
    }

    doubt.replies.push({
      userId: new Types.ObjectId(addReplyDto.userId),
      message: addReplyDto.message,
      createdAt: new Date(),
    });

    await doubt.save();
    return this.findOne(id);
  }

  async resolve(id: string): Promise<Doubt> {
    const doubt = await this.doubtModel
      .findByIdAndUpdate(id, { status: 'resolved' }, { new: true })
      .populate('userId', 'name email avatar')
      .populate('replies.userId', 'name email avatar')
      .exec();
    if (!doubt) {
      throw new NotFoundException(`Doubt with ID "${id}" not found`);
    }
    return doubt;
  }

  async remove(id: string): Promise<void> {
    const result = await this.doubtModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Doubt with ID "${id}" not found`);
    }
  }
}
