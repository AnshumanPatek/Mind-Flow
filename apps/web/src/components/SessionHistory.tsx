import React, { useEffect, useState } from "react";
import { User, StudySession } from "@/types";
import { getStudySessions } from "@/lib/api";
import { History, Clock, FileMinus2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function SessionHistory({ user }: { user: User }) {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getStudySessions(user.id);
        setSessions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (loading) return <div className="p-8 text-slate-500">Loading history...</div>;

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h1 className="text-4xl font-serif font-bold text-slate-900">Your History</h1>
        <p className="text-slate-500 mt-2">Past study sessions tracked securely.</p>
      </header>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400 glass-card rounded-3xl mt-8">
          <FileMinus2 className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-xl font-serif">No study sessions logged yet.</p>
        </div>
      ) : (
        <div className="space-y-4 mt-8">
          {sessions.map((s, i) => (
            <Card key={s.id || i} className="glass-card border-none">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-blue-50 text-blue-500">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Studied for {s.durationMinutes ? s.durationMinutes : Math.floor((s as any).durationSeconds / 60)} minutes
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(s.startTime || (s as any).startedAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
