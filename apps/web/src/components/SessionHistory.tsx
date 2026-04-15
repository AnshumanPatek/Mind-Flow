"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Calendar,
  CalendarDays,
  CalendarRange,
  Clock,
  FileMinus2,
  History,
  Target,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getStudySessions } from "@/lib/api";
import { cn } from "@/lib/utils";
import { StudySession, User } from "@/types";

type HistoryRange = "day" | "week" | "month";

interface SessionGroup {
  key: string;
  label: string;
  sublabel: string;
  startedAt: number;
  totalSeconds: number;
  sessions: StudySession[];
}

const rangeOptions = [
  { id: "day" as const, label: "Day", icon: CalendarDays },
  { id: "week" as const, label: "Week", icon: CalendarRange },
  { id: "month" as const, label: "Month", icon: Calendar },
];

export function SessionHistory({ user, refreshKey = 0 }: { user: User; refreshKey?: number }) {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [activeRange, setActiveRange] = useState<HistoryRange>("day");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await getStudySessions(user.id);
        if (isMounted) setSessions(data);
      } catch (err) {
        console.error(err);
        if (isMounted) setError("Could not load your study sessions.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [user.id, refreshKey]);

  const groups = useMemo(() => groupSessions(sessions, activeRange), [sessions, activeRange]);
  const totalSeconds = useMemo(
    () => sessions.reduce((total, session) => total + session.durationSeconds, 0),
    [sessions],
  );
  const longestSession = useMemo(
    () => sessions.reduce((longest, session) => Math.max(longest, session.durationSeconds), 0),
    [sessions],
  );

  if (loading) {
    return <div className="p-8 text-slate-500">Loading history...</div>;
  }

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <History className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">Session History</h1>
          <p className="mt-2 text-slate-500">
            {user.name}&apos;s study sessions, grouped by day, week, and month.
          </p>
        </div>

        <div className="inline-flex w-fit rounded-2xl bg-slate-100 p-1">
          {rangeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = activeRange === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setActiveRange(option.id)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-colors",
                  isActive
                    ? "bg-white text-brand-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-900",
                )}
              >
                <Icon className="h-4 w-4" />
                {option.label}
              </button>
            );
          })}
        </div>
      </header>

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="mt-8 flex min-h-[48vh] flex-col items-center justify-center rounded-3xl border border-slate-200/50 bg-white p-12 text-center shadow-sm">
          <FileMinus2 className="mb-4 h-16 w-16 text-brand-200" />
          <h2 className="text-2xl font-serif font-bold text-slate-900">No study sessions yet</h2>
          <p className="mt-2 max-w-md text-lg text-slate-500">
            Start and stop the timer to save a session here for this user.
          </p>
        </div>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <SummaryStat label="Total Study Time" value={formatDuration(totalSeconds)} />
            <SummaryStat label="Sessions" value={sessions.length.toString()} />
            <SummaryStat label="Longest Session" value={formatDuration(longestSession)} />
          </section>

          <section className="space-y-4">
            {groups.map((group) => (
              <Card key={group.key} className="glass-card border-none">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-slate-900">{group.label}</h2>
                      <p className="mt-1 text-sm font-medium text-slate-500">{group.sublabel}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-brand-50 text-brand-700">{formatDuration(group.totalSeconds)}</Badge>
                      <Badge variant="outline">
                        {group.sessions.length} {group.sessions.length === 1 ? "session" : "sessions"}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {group.sessions.map((session) => (
                      <SessionRow key={session.id} session={session} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        </>
      )}
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/50 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function SessionRow({ session }: { session: StudySession }) {
  const subject = session.chapterTitle || session.goalTitle || "General study session";
  const detail = session.chapterTitle && session.goalTitle ? session.goalTitle : "Study time";

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
          {session.chapterTitle ? <BookOpen className="h-5 w-5" /> : <Target className="h-5 w-5" />}
        </div>
        <div className="min-w-0">
          <p className="truncate font-bold text-slate-900">{subject}</p>
          <p className="mt-1 truncate text-sm text-slate-500">{detail}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-slate-400" />
          {formatSessionTime(session)}
        </span>
        <Badge variant="outline">{formatDuration(session.durationSeconds)}</Badge>
      </div>
    </div>
  );
}

function groupSessions(sessions: StudySession[], range: HistoryRange): SessionGroup[] {
  const groups = new Map<string, SessionGroup>();

  sessions
    .filter((session) => session.startedAt)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .forEach((session) => {
      const startDate = new Date(session.startedAt);
      const meta = getGroupMeta(startDate, range);
      const existing = groups.get(meta.key);

      if (existing) {
        existing.totalSeconds += session.durationSeconds;
        existing.sessions.push(session);
      } else {
        groups.set(meta.key, {
          ...meta,
          totalSeconds: session.durationSeconds,
          sessions: [session],
        });
      }
    });

  return Array.from(groups.values()).sort((a, b) => b.startedAt - a.startedAt);
}

function getGroupMeta(date: Date, range: HistoryRange) {
  if (range === "month") {
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: monthStart.toLocaleDateString(undefined, { month: "long", year: "numeric" }),
      sublabel: "Monthly study overview",
      startedAt: monthStart.getTime(),
    };
  }

  if (range === "week") {
    const weekStart = startOfWeek(date);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return {
      key: dateKey(weekStart),
      label: `${formatShortDate(weekStart)} - ${formatShortDate(weekEnd)}`,
      sublabel: "Weekly study overview",
      startedAt: weekStart.getTime(),
    };
  }

  const dayStart = startOfDay(date);

  return {
    key: dateKey(dayStart),
    label: formatDayLabel(dayStart),
    sublabel: dayStart.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    startedAt: dayStart.getTime(),
  };
}

function formatSessionTime(session: StudySession) {
  const start = new Date(session.startedAt);
  const end = new Date(start.getTime() + session.durationSeconds * 1000);

  return `${formatTime(start)} - ${formatTime(end)}`;
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${Math.max(1, seconds)} sec`;

  const totalMinutes = Math.max(1, Math.round(seconds / 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr`;
  return `${hours} hr ${minutes} min`;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function formatShortDate(date: Date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatDayLabel(date: Date) {
  const today = startOfDay(new Date()).getTime();
  const day = date.getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  if (day === today) return "Today";
  if (day === today - oneDay) return "Yesterday";
  return formatShortDate(date);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date: Date) {
  const dayStart = startOfDay(date);
  const day = dayStart.getDay();
  const diff = day === 0 ? 6 : day - 1;
  dayStart.setDate(dayStart.getDate() - diff);
  return dayStart;
}

function dateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}
