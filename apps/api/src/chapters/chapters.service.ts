import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chapter } from './schemas/chapter.schema';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';

@Injectable()
export class ChaptersService {
  constructor(@InjectModel(Chapter.name) private readonly chapterModel: Model<Chapter>) {}

  async create(createChapterDto: CreateChapterDto): Promise<Chapter> {
    const chapter = new this.chapterModel({
      ...createChapterDto,
      topicId: new Types.ObjectId(createChapterDto.topicId),
    });
    return chapter.save();
  }

  async findByTopic(topicId: string): Promise<Chapter[]> {
    return this.chapterModel
      .find({ topicId: new Types.ObjectId(topicId) })
      .sort({ order: 1, createdAt: 1 })
      .exec();
  }

  async findById(id: string): Promise<Chapter> {
    const chapter = await this.chapterModel.findById(id).exec();
    if (!chapter) {
      throw new NotFoundException(`Chapter with ID "${id}" not found`);
    }
    return chapter;
  }

  async update(id: string, updateChapterDto: UpdateChapterDto): Promise<Chapter> {
    const chapter = await this.chapterModel
      .findByIdAndUpdate(id, { $set: updateChapterDto }, { new: true, runValidators: true })
      .exec();
    if (!chapter) {
      throw new NotFoundException(`Chapter with ID "${id}" not found`);
    }
    return chapter;
  }

  async remove(id: string): Promise<void> {
    const chapter = await this.chapterModel.findByIdAndDelete(id).exec();
    if (!chapter) {
      throw new NotFoundException(`Chapter with ID "${id}" not found`);
    }
  }

  async removeByTopic(topicId: string): Promise<void> {
    await this.chapterModel.deleteMany({ topicId: new Types.ObjectId(topicId) }).exec();
  }
}
