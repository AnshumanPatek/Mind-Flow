declare class GoalSettingsDto {
    virtualRoomUrl?: string;
}
export declare class CreateGoalDto {
    title: string;
    description?: string;
    adminId: string;
    settings?: GoalSettingsDto;
}
export {};
