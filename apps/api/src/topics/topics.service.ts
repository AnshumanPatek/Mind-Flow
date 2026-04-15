import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Topic } from './schemas/topic.schema';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Injectable()
export class TopicsService {
  constructor(@InjectModel(Topic.name) private readonly topicModel: Model<Topic>) {}

  async create(createTopicDto: CreateTopicDto): Promise<Topic> {
    const topic = new this.topicModel({
      ...createTopicDto,
      chapterId: new Types.ObjectId(createTopicDto.chapterId),
    });
    return topic.save();
  }

  async findByChapter(chapterId: string): Promise<Topic[]> {
    return this.topicModel
      .find({ chapterId: new Types.ObjectId(chapterId) })
      .sort({ order: 1, createdAt: 1 })
      .exec();
  }

  async findById(id: string): Promise<Topic> {
    const topic = await this.topicModel.findById(id).exec();
    if (!topic) {
      throw new NotFoundException(`Topic with ID "${id}" not found`);
    }
    return topic;
  }

  async update(id: string, updateTopicDto: UpdateTopicDto): Promise<Topic> {
    const topic = await this.topicModel
      .findByIdAndUpdate(id, { $set: updateTopicDto }, { new: true, runValidators: true })
      .exec();
    if (!topic) {
      throw new NotFoundException(`Topic with ID "${id}" not found`);
    }
    return topic;
  }

  async remove(id: string): Promise<void> {
    const topic = await this.topicModel.findByIdAndDelete(id).exec();
    if (!topic) {
      throw new NotFoundException(`Topic with ID "${id}" not found`);
    }
  }

  async removeByGoal(goalId: string): Promise<void> {
    await this.topicModel.deleteMany({ goalId: new Types.ObjectId(goalId) }).exec();
  }

  async removeByChapter(chapterId: string): Promise<void> {
    await this.topicModel.deleteMany({ chapterId: new Types.ObjectId(chapterId) }).exec();
  }
}
