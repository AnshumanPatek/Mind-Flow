import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReactionDto {
  @IsOptional()
  @IsString()
  type?: string; // emoji, defaults to 🔥

  @IsMongoId()
  @IsNotEmpty()
  chapterId: string;

  @IsMongoId()
  @IsNotEmpty()
  giverId: string;

  @IsMongoId()
  @IsNotEmpty()
  receiverId: string;
}
