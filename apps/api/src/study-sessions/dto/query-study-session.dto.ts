import { IsMongoId, IsOptional } from 'class-validator';

export class QueryStudySessionDto {
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsOptional()
  @IsMongoId()
  goalId?: string;

  @IsOptional()
  @IsMongoId()
  chapterId?: string;
}
