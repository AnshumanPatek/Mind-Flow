import { Model } from 'mongoose';
import { Topic } from './schemas/topic.schema';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
export declare class TopicsService {
    private readonly topicModel;
    constructor(topicModel: Model<Topic>);
    create(createTopicDto: CreateTopicDto): Promise<Topic>;
    findByChapter(chapterId: string): Promise<Topic[]>;
    findById(id: string): Promise<Topic>;
    update(id: string, updateTopicDto: UpdateTopicDto): Promise<Topic>;
    remove(id: string): Promise<void>;
    removeByGoal(goalId: string): Promise<void>;
    removeByChapter(chapterId: string): Promise<void>;
}
