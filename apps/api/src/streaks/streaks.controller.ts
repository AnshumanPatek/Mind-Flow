import { Controller, Get, Post, Param } from '@nestjs/common';
import { StreaksService } from './streaks.service';

@Controller('streaks')
export class StreaksController {
  constructor(private readonly streaksService: StreaksService) {}

  @Post('update/:userId')
  updateStreak(@Param('userId') userId: string) {
    return this.streaksService.updateStreak(userId);
  }

  @Get(':userId')
  getStreak(@Param('userId') userId: string) {
    return this.streaksService.getStreak(userId);
  }

  @Get()
  getAllStreaks() {
    return this.streaksService.getAllStreaks();
  }
}
