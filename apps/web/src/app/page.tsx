"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Flame,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Target,
  Trophy,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Dashboard } from "@/components/Dashboard";
import { GoalDetail } from "@/components/GoalDetail";
import { Leaderboard } from "@/components/Leaderboard";
import { SessionHistory } from "@/components/SessionHistory";
import { StudyTimer } from "@/components/StudyTimer";
import { Login } from "@/components/Login";
import { CreateGoalModal } from "@/components/CreateGoalModal";
import { cn } from "@/lib/utils";
import { Goal, LeaderboardEntry, User } from "@/types";
import { getGoals, getLeaderboard, getUsers, logStudySession, getUserStats } from "@/lib/api";

type View = "dashboard" | "goal-detail" | "leaderboard" | "history" | "profile";

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [sessionHistoryRefreshKey, setSessionHistoryRefreshKey] = useState(0);

  const fetchMainData = async () => {
    try {
      const [fetchedUsers, fetchedGoals] = await Promise.all([
        getUsers(),
        getGoals(),
      ]);
      setAllUsers(fetchedUsers || []);

      const activeGoals = fetchedGoals || [];
      setGoals(activeGoals);

      if (activeGoals.length > 0) {
        const fetchedLeaderboard = await getLeaderboard(activeGoals[0].id);
        setLeaderboard(fetchedLeaderboard);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMainData();
  }, []);

  const handleSelectGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setCurrentView("goal-detail");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "history", label: "Session History", icon: History },
  ];

  if (!user && !loading) {
    return <Login availableUsers={allUsers} onLogin={async (u) => {
      try {
        const stats = await getUserStats(u.id);
        setUser({ ...u, ...stats });
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
        setUser(u);
      }
    }} />;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading MindFlow...</div>;
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen flex bg-slate-50/50">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 glass-card border-r border-slate-200/50 transition-transform duration-300 lg:relative lg:translate-x-0",
            !isSidebarOpen && "-translate-x-full",
          )}
        >
          <div className="h-full flex flex-col p-6">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-200">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
                MindFlow
              </span>
            </div>

            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as View)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group",
                    currentView === item.id
                      ? "bg-brand-600 text-white shadow-lg shadow-brand-100"
                      : "text-slate-500 hover:bg-brand-50 hover:text-brand-600",
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 transition-transform group-hover:scale-110",
                      currentView === item.id
                        ? "text-white"
                        : "text-slate-400 group-hover:text-brand-600",
                    )}
                  />
                  <span className="font-bold">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-100">
              <div
                className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer"
                onClick={() => setCurrentView("profile")}
              >
                <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback>{user?.name?.[0] || "A"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {user?.name || "Guest"}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.email || "guest@example.com"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start mt-4 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
                onClick={() => setUser(null)}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <header className="h-20 flex items-center justify-between px-8 bg-white/30 backdrop-blur-md border-b border-slate-200/50 z-30">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X /> : <Menu />}
              </Button>
              <div className="hidden md:block">
                <StudyTimer
                  goalTitle={selectedGoal?.title}
                  onComplete={async (durationSeconds) => {
                    if (!user?.id) return;

                    try {
                      await logStudySession({
                        durationSeconds,
                        startedAt: new Date(Date.now() - durationSeconds * 1000).toISOString(),
                        userId: user.id,
                        goalId: selectedGoal?.id,
                      });
                      setSessionHistoryRefreshKey((key) => key + 1);
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  onNavigate={() => setCurrentView("history")}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-yellow-50 rounded-full border border-yellow-100">
                <Trophy className="w-4 h-4 text-yellow-600 fill-current" />
                <span className="text-sm font-bold text-yellow-700">
                  {user?.streak || 0} day streak
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full border border-orange-100">
                <Flame className="w-4 h-4 text-orange-500 fill-current" />
                <span className="text-sm font-bold text-orange-700">
                  {user?.respectPoints || 0}
                </span>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-6xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView + (selectedGoal?.id || "")}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentView === "dashboard" && (
                    <Dashboard
                      user={user!}
                      goals={goals}
                      onSelectGoal={handleSelectGoal}
                      onCreateGoal={() => setShowCreateGoal(true)}
                    />
                  )}
                  {currentView === "goal-detail" && selectedGoal && (
                    <GoalDetail
                      user={user!}
                      goal={selectedGoal}
                      onBack={() => setCurrentView("dashboard")}
                      onRefresh={async () => {
                        // Fetch fresh data
                        const [fetchedUsers, fetchedGoals] = await Promise.all([
                          getUsers(),
                          getGoals(),
                        ]);
                        setAllUsers(fetchedUsers || []);
                        const activeGoals = fetchedGoals || [];
                        setGoals(activeGoals);
                        
                        // Update the selected goal with fresh data
                        const updatedGoal = activeGoals.find(g => g.id === selectedGoal.id);
                        if (updatedGoal) {
                          setSelectedGoal(updatedGoal);
                        }
                      }}
                    />
                  )}
                  {currentView === "leaderboard" && <Leaderboard entries={leaderboard} />}
                  {currentView === "history" && user && (
                    <SessionHistory user={user} refreshKey={sessionHistoryRefreshKey} />
                  )}
                  {currentView === "profile" && user && (
                    <div className="max-w-2xl mx-auto space-y-6">
                      <div className="bg-white rounded-3xl p-8 border border-slate-200/50 shadow-sm flex flex-col items-center text-center">
                        <Avatar className="w-32 h-32 border-4 border-white shadow-xl mb-4">
                          <AvatarImage src={user.avatarUrl} />
                          <AvatarFallback className="text-4xl">{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <h1 className="text-3xl font-serif font-bold text-slate-900">{user.name}</h1>
                        <p className="text-slate-500 mb-6">{user.email}</p>

                        <div className="grid grid-cols-3 gap-6 w-full pt-6 border-t border-slate-100">
                          <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-slate-900">{user.totalHours || 0}h</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Time</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-slate-900">{user.chaptersCompleted || 0}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chapters</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-slate-900">{user.respectPoints || 0}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Respect</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>

        {showCreateGoal && user && (
          <CreateGoalModal
            user={user}
            isOpen={showCreateGoal}
            onClose={() => setShowCreateGoal(false)}
            onCreated={() => {
              setShowCreateGoal(false);
              fetchMainData();
            }}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
