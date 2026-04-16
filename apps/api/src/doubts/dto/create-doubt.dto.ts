import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateDoubtDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsMongoId()
  goalId: string;

  @IsNotEmpty()
  @IsMongoId()
  userId: string;
}
