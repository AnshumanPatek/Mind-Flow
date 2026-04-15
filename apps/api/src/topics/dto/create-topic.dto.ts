import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsMongoId()
  @IsNotEmpty()
  chapterId: string;
}
