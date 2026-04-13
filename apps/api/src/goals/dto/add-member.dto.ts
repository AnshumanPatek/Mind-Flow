import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { GoalRole } from '@mindflow/shared';

export class AddMemberDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsEnum(GoalRole)
  role?: GoalRole;
}
