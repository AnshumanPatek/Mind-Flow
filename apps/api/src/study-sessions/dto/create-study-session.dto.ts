import { IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateStudySessionDto {
  @IsNumber()
  @Min(1)
  durationSeconds: number;

  @IsDateString()
  @IsNotEmpty()
  startedAt: string;

  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  goalId: string;

  @IsOptional()
  @IsMongoId()
  chapterId?: string;
}
