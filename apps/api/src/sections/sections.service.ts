import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Section } from './schemas/section.schema';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class SectionsService {
  constructor(@InjectModel(Section.name) private readonly sectionModel: Model<Section>) {}

  async create(createSectionDto: CreateSectionDto): Promise<Section> {
    const section = new this.sectionModel({
      ...createSectionDto,
      goalId: new Types.ObjectId(createSectionDto.goalId),
    });
    return section.save();
  }

  async findByGoal(goalId: string): Promise<Section[]> {
    return this.sectionModel
      .find({ goalId: new Types.ObjectId(goalId) })
      .sort({ order: 1, createdAt: 1 })
      .exec();
  }

  async findById(id: string): Promise<Section> {
    const section = await this.sectionModel.findById(id).exec();
    if (!section) {
      throw new NotFoundException(`Section with ID "${id}" not found`);
    }
    return section;
  }

  async update(id: string, updateSectionDto: UpdateSectionDto): Promise<Section> {
    const section = await this.sectionModel
      .findByIdAndUpdate(id, { $set: updateSectionDto }, { new: true, runValidators: true })
      .exec();
    if (!section) {
      throw new NotFoundException(`Section with ID "${id}" not found`);
    }
    return section;
  }

  async remove(id: string): Promise<void> {
    const section = await this.sectionModel.findByIdAndDelete(id).exec();
    if (!section) {
      throw new NotFoundException(`Section with ID "${id}" not found`);
    }
  }

  async removeByGoal(goalId: string): Promise<void> {
    await this.sectionModel.deleteMany({ goalId: new Types.ObjectId(goalId) }).exec();
  }
}
