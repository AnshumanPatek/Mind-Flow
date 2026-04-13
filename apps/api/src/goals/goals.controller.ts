import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { AddMemberDto } from './dto/add-member.dto';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  create(@Body() createGoalDto: CreateGoalDto) {
    return this.goalsService.create(createGoalDto);
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.goalsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goalsService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    return this.goalsService.update(id, updateGoalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goalsService.remove(id);
  }

  // ─── Members ────────────────────────────────────────────

  @Post(':id/members')
  addMember(@Param('id') id: string, @Body() addMemberDto: AddMemberDto) {
    return this.goalsService.addMember(id, addMemberDto);
  }

  @Get(':id/members')
  getMembers(@Param('id') id: string) {
    return this.goalsService.getMembers(id);
  }

  @Delete(':id/members/:userId')
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.goalsService.removeMember(id, userId);
  }

  // ─── Leaderboard ────────────────────────────────────────

  @Get(':id/leaderboard')
  getLeaderboard(@Param('id') id: string) {
    return this.goalsService.getLeaderboard(id);
  }
}
