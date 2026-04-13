import { Model } from 'mongoose';
import { Chapter } from './schemas/chapter.schema';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
export declare class ChaptersService {
    private readonly chapterModel;
    constructor(chapterModel: Model<Chapter>);
    create(createChapterDto: CreateChapterDto): Promise<Chapter>;
    findByTopic(topicId: string): Promise<Chapter[]>;
    findById(id: string): Promise<Chapter>;
    update(id: string, updateChapterDto: UpdateChapterDto): Promise<Chapter>;
    remove(id: string): Promise<void>;
    removeByTopic(topicId: string): Promise<void>;
}
