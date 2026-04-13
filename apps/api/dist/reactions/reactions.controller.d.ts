import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
export declare class ReactionsController {
    private readonly reactionsService;
    constructor(reactionsService: ReactionsService);
    create(createReactionDto: CreateReactionDto): Promise<import("./schemas/reaction.schema").Reaction>;
    findByChapter(chapterId: string): Promise<import("./schemas/reaction.schema").Reaction[]>;
    findByReceiver(receiverId: string): Promise<import("./schemas/reaction.schema").Reaction[]>;
    remove(id: string): Promise<void>;
}
