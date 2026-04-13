// ─── Enums ───────────────────────────────────────────────

export enum SystemRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  USER = 'USER',
}

export enum GoalRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum ChapterStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

// ─── Interfaces ──────────────────────────────────────────

export interface IUser {
  _id: string;
  email: string;
  name: string;
  avatar?: string | null;
  role: SystemRole;
  lastSeenAt?: Date | null;
}

export interface IGoal {
  _id: string;
  title: string;
  description?: string;
  settings?: {
    virtualRoomUrl?: string;
  };
  adminId: string | IUser;
}

export interface IGoalMember {
  _id: string;
  role: GoalRole;
  userId: string | IUser;
  goalId: string;
}

export interface ITopic {
  _id: string;
  title: string;
  description?: string;
  order: number;
  goalId: string;
}

export interface IChapter {
  _id: string;
  title: string;
  status: ChapterStatus;
  order: number;
  topicId: string;
}

export interface IStudySession {
  _id: string;
  durationSeconds: number;
  startedAt: Date;
  userId: string | IUser;
  goalId: string;
  chapterId?: string;
}

export interface IReaction {
  _id: string;
  type: string;
  chapterId: string;
  giverId: string | IUser;
  receiverId: string | IUser;
}
