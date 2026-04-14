import React, { useEffect, useState } from "react";
import { getAdminStats, getAdminUsers, getAdminGoals, getAdminActivity } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Activity, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [st, us] = await Promise.all([getAdminStats(), getAdminUsers()]);
        setStats(st);
        setRecentUsers(us.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  if (!stats) return <div className="p-8">Loading admin data...</div>;

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-brand-600" />
        <h1 className="text-4xl font-serif font-bold text-slate-900">System Admin</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card border-none">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-500">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-none">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-brand-50 text-brand-500">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Goals</p>
              <p className="text-2xl font-bold">{stats.totalGoals || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-none">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-orange-50 text-orange-500">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Sessions</p>
              <p className="text-2xl font-bold">{stats.totalStudySessions || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="glass-card rounded-3xl p-6">
        <h3 className="font-serif font-bold text-xl mb-6">Recent Users</h3>
        <div className="space-y-4">
          {recentUsers.map(u => (
            <div key={u._id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={u.avatar} />
                  <AvatarFallback>{u.name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
              </div>
              <div className="text-xs text-slate-400">
                Joined: {new Date(u.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
