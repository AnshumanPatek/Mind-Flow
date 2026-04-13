"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Bell,
  Flame,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
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
import { StudyTimer } from "@/components/StudyTimer";
import { MOCK_GOALS, MOCK_USER } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Goal } from "@/types";

type View = "dashboard" | "goal-detail" | "leaderboard" | "history";

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSelectGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setCurrentView("goal-detail");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "history", label: "Session History", icon: History },
  ];

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
              <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer">
                <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                  <AvatarImage src={MOCK_USER.avatarUrl} />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {MOCK_USER.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {MOCK_USER.email}
                  </p>
                </div>
                <Settings className="w-4 h-4 text-slate-400" />
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start mt-4 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
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
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search goals, topics..."
                  className="pl-10 pr-4 py-2 bg-slate-100/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-500 w-64 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full border border-orange-100">
                <Flame className="w-4 h-4 text-orange-500 fill-current" />
                <span className="text-sm font-bold text-orange-700">
                  {MOCK_USER.respectPoints}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="relative rounded-xl">
                <Bell className="w-5 h-5 text-slate-500" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </Button>
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
                      onSelectGoal={handleSelectGoal}
                      onCreateGoal={() => undefined}
                    />
                  )}
                  {currentView === "goal-detail" && selectedGoal && (
                    <GoalDetail
                      goal={selectedGoal}
                      onBack={() => setCurrentView("dashboard")}
                    />
                  )}
                  {currentView === "leaderboard" && <Leaderboard />}
                  {currentView === "history" && (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
                      <History className="w-16 h-16 mb-4 opacity-20" />
                      <p className="text-xl font-serif">
                        Session history coming soon...
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>

        <StudyTimer
          goalTitle={selectedGoal?.title}
          onComplete={(mins) => console.log(`Completed ${mins} mins`)}
        />
      </div>
    </TooltipProvider>
  );
}
