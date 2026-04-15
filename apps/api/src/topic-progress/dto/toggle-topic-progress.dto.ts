import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ToggleTopicProgressDto {
  @IsMongoId()
  @IsNotEmpty()
  topicId: string;

  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  goalId: string;
}
