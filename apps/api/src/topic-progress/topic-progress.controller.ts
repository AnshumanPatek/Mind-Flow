import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { TopicProgressService } from './topic-progress.service';
import { ToggleTopicProgressDto } from './dto/toggle-topic-progress.dto';

@Controller('topic-progress')
export class TopicProgressController {
  constructor(private readonly topicProgressService: TopicProgressService) {}

  @Post('toggle')
  toggleProgress(@Body() dto: ToggleTopicProgressDto) {
    return this.topicProgressService.toggleProgress(dto);
  }

  @Get()
  getProgress(@Query('goalId') goalId: string, @Query('userId') userId: string) {
    return this.topicProgressService.getProgressByGoal(goalId, userId);
  }

  @Get('all')
  getAllProgress(@Query('goalId') goalId: string) {
    return this.topicProgressService.getProgressByGoalAllUsers(goalId);
  }
}
