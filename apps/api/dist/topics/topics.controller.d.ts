import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
export declare class TopicsController {
    private readonly topicsService;
    constructor(topicsService: TopicsService);
    create(createTopicDto: CreateTopicDto): Promise<import("./schemas/topic.schema").Topic>;
    findByGoal(goalId: string): Promise<import("./schemas/topic.schema").Topic[]>;
    findOne(id: string): Promise<import("./schemas/topic.schema").Topic>;
    update(id: string, updateTopicDto: UpdateTopicDto): Promise<import("./schemas/topic.schema").Topic>;
    remove(id: string): Promise<void>;
}
