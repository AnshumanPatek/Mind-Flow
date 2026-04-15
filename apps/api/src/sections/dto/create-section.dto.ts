import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsString()
  @IsNotEmpty()
  goalId: string;
}
