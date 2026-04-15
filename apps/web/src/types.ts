export type UserRole = "owner" | "member";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  totalHours: number;
  chaptersCompleted: number;
  respectPoints: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  members: GoalMembership[];
  sections: Section[];
  virtualRoomUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoalMembership {
  goalId: string;
  userId: string;
  role: UserRole;
  user: User;
}

export interface Section {
  id: string;
  goalId: string;
  title: string;
  description?: string;
  chapters: Chapter[];
  order: number;
}

export interface Chapter {
  id: string;
  sectionId: string;
  title: string;
  description?: string;
  topics: Topic[];
  order: number;
  status?: string;
}

export interface Topic {
  id: string;
  chapterId: string;
  title: string;
  description?: string;
  order: number;
}

export interface ChapterProgress {
  id: string;
  chapterId: string;
  userId: string;
  isCompleted: boolean;
  completedAt?: string;
  respectReactions: RespectReaction[];
}

export interface RespectReaction {
  id: string;
  progressId: string;
  userId: string;
  createdAt: string;
}

export interface StudySession {
  id: string;
  userId: string;
  goalId?: string;
  goalTitle?: string;
  chapterId?: string;
  chapterTitle?: string;
  startedAt: string;
  durationSeconds: number;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatarUrl?: string;
  chaptersCompleted: number;
  respectPoints: number;
  totalHours: number;
  rank: number;
}
