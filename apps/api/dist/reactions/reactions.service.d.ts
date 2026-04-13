import { Model } from 'mongoose';
import { Reaction } from './schemas/reaction.schema';
import { CreateReactionDto } from './dto/create-reaction.dto';
export declare class ReactionsService {
    private readonly reactionModel;
    constructor(reactionModel: Model<Reaction>);
    create(dto: CreateReactionDto): Promise<Reaction>;
    findByChapter(chapterId: string): Promise<Reaction[]>;
    findByReceiver(receiverId: string): Promise<Reaction[]>;
    remove(id: string): Promise<void>;
    countByReceiver(receiverId: string): Promise<number>;
}
