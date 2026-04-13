import { IsNotEmpty, IsOptional, IsString, IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class GoalSettingsDto {
  @IsOptional()
  @IsString()
  virtualRoomUrl?: string;
}

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsMongoId()
  @IsNotEmpty()
  adminId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GoalSettingsDto)
  settings?: GoalSettingsDto;
}
