import { Goal, LeaderboardEntry, StudySession, User } from "@/types";

export const MOCK_USER: User = {
  id: "u1",
  name: "Anshuman",
  email: "anshuman@example.com",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anshuman",
  totalHours: 45.5,
  chaptersCompleted: 12,
  respectPoints: 24,
};

export const MOCK_FRIENDS: User[] = [
  {
    id: "u2",
    name: "Sarah",
    email: "sarah@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    totalHours: 38.2,
    chaptersCompleted: 10,
    respectPoints: 18,
  },
  {
    id: "u3",
    name: "Mike",
    email: "mike@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    totalHours: 52.1,
    chaptersCompleted: 15,
    respectPoints: 32,
  },
  {
    id: "u4",
    name: "Elena",
    email: "elena@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    totalHours: 29.5,
    chaptersCompleted: 8,
    respectPoints: 12,
  },
];

export const MOCK_GOALS: Goal[] = [
  {
    id: "g1",
    title: "Mastering React & Next.js",
    description:
      "A comprehensive journey from basics to advanced full-stack development.",
    ownerId: "u1",
    virtualRoomUrl: "https://meet.google.com/abc-defg-hij",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    members: [
      { goalId: "g1", userId: "u1", role: "owner", user: MOCK_USER },
      { goalId: "g1", userId: "u2", role: "member", user: MOCK_FRIENDS[0] },
      { goalId: "g1", userId: "u3", role: "member", user: MOCK_FRIENDS[1] },
    ],
    topics: [
      {
        id: "t1",
        goalId: "g1",
        title: "React Fundamentals",
        order: 1,
        chapters: [
          { id: "c1", topicId: "t1", title: "JSX & Components", order: 1, progress: [] },
          { id: "c2", topicId: "t1", title: "State & Props", order: 2, progress: [] },
          {
            id: "c3",
            topicId: "t1",
            title: "Hooks (useState, useEffect)",
            order: 3,
            progress: [],
          },
        ],
      },
      {
        id: "t2",
        goalId: "g1",
        title: "Advanced React Patterns",
        order: 2,
        chapters: [
          { id: "c4", topicId: "t2", title: "Context API", order: 1, progress: [] },
          { id: "c5", topicId: "t2", title: "Custom Hooks", order: 2, progress: [] },
          {
            id: "c6",
            topicId: "t2",
            title: "Performance Optimization",
            order: 3,
            progress: [],
          },
        ],
      },
    ],
  },
  {
    id: "g2",
    title: "Data Structures & Algorithms",
    description: "Cracking the coding interview together.",
    ownerId: "u2",
    virtualRoomUrl: "https://discord.gg/study-group",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    members: [
      { goalId: "g2", userId: "u2", role: "owner", user: MOCK_FRIENDS[0] },
      { goalId: "g2", userId: "u1", role: "member", user: MOCK_USER },
      { goalId: "g2", userId: "u4", role: "member", user: MOCK_FRIENDS[2] },
    ],
    topics: [
      {
        id: "t3",
        goalId: "g2",
        title: "Arrays & Strings",
        order: 1,
        chapters: [
          { id: "c7", topicId: "t3", title: "Two Pointers", order: 1, progress: [] },
          { id: "c8", topicId: "t3", title: "Sliding Window", order: 2, progress: [] },
        ],
      },
    ],
  },
];

export const MOCK_SESSIONS: StudySession[] = [
  {
    id: "s1",
    userId: "u1",
    goalId: "g1",
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    durationMinutes: 60,
  },
  {
    id: "s2",
    userId: "u1",
    goalId: "g1",
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 60,
  },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    userId: "u3",
    userName: "Mike",
    avatarUrl: MOCK_FRIENDS[1].avatarUrl,
    chaptersCompleted: 15,
    respectPoints: 32,
    totalHours: 52.1,
    rank: 1,
  },
  {
    userId: "u1",
    userName: "Anshuman",
    avatarUrl: MOCK_USER.avatarUrl,
    chaptersCompleted: 12,
    respectPoints: 24,
    totalHours: 45.5,
    rank: 2,
  },
  {
    userId: "u2",
    userName: "Sarah",
    avatarUrl: MOCK_FRIENDS[0].avatarUrl,
    chaptersCompleted: 10,
    respectPoints: 18,
    totalHours: 38.2,
    rank: 3,
  },
  {
    userId: "u4",
    userName: "Elena",
    avatarUrl: MOCK_FRIENDS[2].avatarUrl,
    chaptersCompleted: 8,
    respectPoints: 12,
    totalHours: 29.5,
    rank: 4,
  },
];
