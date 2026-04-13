import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ChapterStatus } from '@mindflow/shared';

export class UpdateChapterDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(ChapterStatus)
  status?: ChapterStatus;

  @IsOptional()
  @IsNumber()
  order?: number;
}
