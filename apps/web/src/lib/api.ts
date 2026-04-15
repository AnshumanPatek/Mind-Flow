import { Goal, GoalMembership, Topic, Chapter, User, StudySession, LeaderboardEntry } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/** USERS */
export async function getUsers(): Promise<User[]> {
  const res = await fetchJson<any[]>(`${API_BASE}/users`);
  return res.map(mapUser);
}

export async function getUser(id: string): Promise<User> {
  const res = await fetchJson<any>(`${API_BASE}/users/${id}`);
  return mapUser(res);
}

export async function createUser(data: { email: string; name: string; avatar?: string }): Promise<User> {
  const res = await fetchJson<any>(`${API_BASE}/users`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return mapUser(res);
}

/** GOALS */
export async function getGoals(userId?: string): Promise<Goal[]> {
  const url = userId ? `${API_BASE}/goals?userId=${userId}` : `${API_BASE}/goals`;
  const rawGoals = await fetchJson<any[]>(url);
  
  // We fetch details in parallel for each goal
  const goalsWithDetails = await Promise.all(
    rawGoals.map(async (rawGoal) => {
      const goalId = rawGoal._id || rawGoal.id;
      
      // Fetch members and sections in parallel
      const [rawMembers, rawSections] = await Promise.all([
        fetchJson<any[]>(`${API_BASE}/goals/${goalId}/members`).catch(() => []),
        fetchJson<any[]>(`${API_BASE}/sections?goalId=${goalId}`).catch(() => []),
      ]);

      // For each section, fetch chapters
      const sections = await Promise.all(
        rawSections.map(async (rawSection) => {
          const sectionId = rawSection._id || rawSection.id;
          const rawChapters = await fetchJson<any[]>(`${API_BASE}/chapters?sectionId=${sectionId}`).catch(() => []);
          
          // For each chapter, fetch topics
          const chapters = await Promise.all(
            rawChapters.map(async (rawChapter) => {
              const chapterId = rawChapter._id || rawChapter.id;
              const rawTopics = await fetchJson<any[]>(`${API_BASE}/topics?chapterId=${chapterId}`).catch(() => []);
              
              return {
                id: chapterId,
                sectionId: sectionId,
                title: rawChapter.title,
                description: rawChapter.description,
                order: rawChapter.order || 0,
                status: rawChapter.status,
                topics: rawTopics.map((t: any) => ({
                  id: t._id || t.id,
                  chapterId: chapterId,
                  title: t.title,
                  description: t.description,
                  order: t.order || 0,
                })).sort((a: any, b: any) => a.order - b.order),
              };
            })
          );
          chapters.sort((a, b) => a.order - b.order);
          
          return {
            id: sectionId,
            goalId,
            title: rawSection.title,
            description: rawSection.description,
            order: rawSection.order || 0,
            chapters,
          };
        })
      );
      sections.sort((a, b) => a.order - b.order);

      const members: GoalMembership[] = rawMembers.map((m: any) => ({
        goalId,
        userId: m.userId?._id ? m.userId._id : m.userId,
        role: m.role ? m.role.toLowerCase() : "member",
        user: mapUser(m.userId),
      }));

      return {
        id: goalId,
        title: rawGoal.title,
        description: rawGoal.description,
        ownerId: rawGoal.adminId || "",
        virtualRoomUrl: rawGoal.settings?.virtualRoomUrl,
        createdAt: rawGoal.createdAt,
        updatedAt: rawGoal.updatedAt,
        members,
        sections,
      } as Goal;
    })
  );

  return goalsWithDetails;
}

export async function createGoal(data: { title: string; description: string; adminId: string; virtualRoomUrl?: string }): Promise<any> {
  return fetchJson(`${API_BASE}/goals`, {
    method: "POST",
    body: JSON.stringify({
      title: data.title,
      description: data.description,
      adminId: data.adminId,
      settings: data.virtualRoomUrl ? { virtualRoomUrl: data.virtualRoomUrl } : undefined
    }),
  });
}

export async function getLeaderboard(goalId: string): Promise<LeaderboardEntry[]> {
  const raw = await fetchJson<any[]>(`${API_BASE}/goals/${goalId}/leaderboard`);
  return raw.map((r, i) => ({
    userId: r.userId,
    userName: r.name,
    avatarUrl: r.avatar,
    totalHours: r.totalSeconds ? r.totalSeconds / 3600 : 0,
    chaptersCompleted: 0,
    respectPoints: 0,
    rank: i + 1,
  }));
}

function mapUser(u: any): User {
  if (!u) return {} as User;
  return {
    id: u._id || u.id || "",
    name: u.name || "Unknown",
    email: u.email || "",
    avatarUrl: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name || "User"}`,
    totalHours: u.totalHours || 0,
    chaptersCompleted: u.chaptersCompleted || 0,
    respectPoints: u.respectPoints || 0,
  };
}

export async function logStudySession(data: { durationSeconds: number; startedAt: string; userId: string; goalId?: string; chapterId?: string }): Promise<StudySession> {
  const res = await fetchJson<any>(`${API_BASE}/study-sessions`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return mapStudySession(res);
}

export async function getStudySessions(userId: string, goalId?: string): Promise<StudySession[]> {
  let url = `${API_BASE}/study-sessions?userId=${userId}`;
  if (goalId) url += `&goalId=${goalId}`;
  const rawSessions = await fetchJson<any[]>(url);
  return rawSessions.map(mapStudySession);
}

function getRefId(ref: any): string | undefined {
  if (!ref) return undefined;
  if (typeof ref === "string") return ref;
  return ref._id || ref.id;
}

function mapStudySession(session: any): StudySession {
  const startedAt = session.startedAt || session.startTime || "";
  const durationSeconds = Number(
    session.durationSeconds ?? (session.durationMinutes ? session.durationMinutes * 60 : 0),
  );
  const startMs = startedAt ? new Date(startedAt).getTime() : 0;
  const endTime =
    startMs && durationSeconds
      ? new Date(startMs + durationSeconds * 1000).toISOString()
      : session.endTime || "";

  return {
    id: session._id || session.id || "",
    userId: getRefId(session.userId) || "",
    goalId: getRefId(session.goalId),
    goalTitle: typeof session.goalId === "object" ? session.goalId?.title : undefined,
    chapterId: getRefId(session.chapterId),
    chapterTitle: typeof session.chapterId === "object" ? session.chapterId?.title : undefined,
    startedAt,
    startTime: startedAt,
    endTime,
    durationSeconds,
    durationMinutes: durationSeconds > 0 ? Math.ceil(durationSeconds / 60) : 0,
  };
}

/** SECTIONS / CHAPTERS / TOPICS */
export async function createSection(data: { title: string; description?: string; goalId: string; order?: number }) {
  return fetchJson(`${API_BASE}/sections`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function createChapter(data: { title: string; sectionId: string; order?: number; status?: string }) {
  return fetchJson(`${API_BASE}/chapters`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function createTopic(data: { title: string; description?: string; chapterId: string; order?: number }) {
  return fetchJson(`${API_BASE}/topics`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateChapterStatus(id: string, status: string) {
  return fetchJson(`${API_BASE}/chapters/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

/** REACTIONS */
export async function giveReaction(data: { type: string; chapterId: string; giverId: string; receiverId: string }) {
  return fetchJson(`${API_BASE}/reactions`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/** ADMIN */
export async function getAdminStats() {
  return fetchJson<any>(`${API_BASE}/admin/stats`);
}
export async function getAdminUsers() {
  return fetchJson<any[]>(`${API_BASE}/admin/users`);
}
export async function getAdminGoals() {
  return fetchJson<any[]>(`${API_BASE}/admin/goals`);
}
export async function getAdminActivity() {
  return fetchJson<any[]>(`${API_BASE}/admin/activity?limit=20`);
}
