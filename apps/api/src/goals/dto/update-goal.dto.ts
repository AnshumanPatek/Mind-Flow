import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class GoalSettingsDto {
  @IsOptional()
  @IsString()
  virtualRoomUrl?: string;
}

export class UpdateGoalDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GoalSettingsDto)
  settings?: GoalSettingsDto;
}
