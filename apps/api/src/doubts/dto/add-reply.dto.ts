import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class AddReplyDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
