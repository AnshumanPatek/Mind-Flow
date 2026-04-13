import { Controller, Get, Query } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats(): Promise<Record<string, number>> {
    return this.adminService.getStats();
  }

  @Get('users')
  getAllUsers(): Promise<Record<string, any>[]> {
    return this.adminService.getAllUsers();
  }

  @Get('goals')
  getAllGoals(): Promise<Record<string, any>[]> {
    return this.adminService.getAllGoals();
  }

  @Get('activity')
  getRecentActivity(@Query('limit') limit?: string): Promise<Record<string, any>[]> {
    return this.adminService.getRecentActivity(limit ? parseInt(limit, 10) : 20);
  }
}
