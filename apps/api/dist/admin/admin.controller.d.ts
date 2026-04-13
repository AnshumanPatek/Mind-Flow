import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getStats(): Promise<Record<string, number>>;
    getAllUsers(): Promise<Record<string, any>[]>;
    getAllGoals(): Promise<Record<string, any>[]>;
    getRecentActivity(limit?: string): Promise<Record<string, any>[]>;
}
