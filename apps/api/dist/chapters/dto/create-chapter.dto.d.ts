import { ChapterStatus } from '@mindflow/shared';
export declare class CreateChapterDto {
    title: string;
    status?: ChapterStatus;
    order?: number;
    topicId: string;
}
