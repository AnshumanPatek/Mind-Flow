export interface IUser {
  _id: string;
  email: string;
  name: string;
  avatar?: string | null;
}

export enum GoalRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface IGoalMember {
  _id: string;
  role: GoalRole;
  userId: string | IUser;
  goalId: string;
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

export interface ITopic {
  _id: string;
  title: string;
  goalId: string;
}

export enum ChapterStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export interface IChapter {
  _id: string;
  title: string;
  status: ChapterStatus;
  topicId: string;
}

export interface IStudySession {
  _id: string;
  durationSeconds: number;
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
