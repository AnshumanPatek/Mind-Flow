import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
export declare class ChaptersController {
    private readonly chaptersService;
    constructor(chaptersService: ChaptersService);
    create(createChapterDto: CreateChapterDto): Promise<import("./schemas/chapter.schema").Chapter>;
    findByTopic(topicId: string): Promise<import("./schemas/chapter.schema").Chapter[]>;
    findOne(id: string): Promise<import("./schemas/chapter.schema").Chapter>;
    update(id: string, updateChapterDto: UpdateChapterDto): Promise<import("./schemas/chapter.schema").Chapter>;
    remove(id: string): Promise<void>;
}
