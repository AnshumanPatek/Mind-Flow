import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ChapterStatus } from '@mindflow/shared';

export class CreateChapterDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsEnum(ChapterStatus)
  status?: ChapterStatus;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsMongoId()
  @IsNotEmpty()
  topicId: string;
}
