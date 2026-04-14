"use client";

import { motion } from "motion/react";
import {
  ChevronRight,
  Clock,
  ExternalLink,
  Flame,
  Plus,
  Target,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Goal, User } from "@/types";
import { cn } from "@/lib/utils";

interface DashboardProps {
  user: User;
  goals: Goal[];
  onSelectGoal: (goal: Goal) => void;
  onCreateGoal: () => void;
}

export function Dashboard({ user, goals, onSelectGoal, onCreateGoal }: DashboardProps) {
  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl font-serif font-bold text-slate-900">
            Welcome back, {user?.name || "Guest"}
          </motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-slate-500 mt-2">
            You have {goals.length} active goals with your friends.
          </motion.p>
        </div>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
          <Button onClick={onCreateGoal} className="bg-brand-600 hover:bg-brand-700 text-white rounded-2xl px-6 py-6 h-auto text-lg shadow-lg shadow-brand-200">
            <Plus className="w-5 h-5 mr-2" />
            New Goal
          </Button>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Study Time", value: `${user?.totalHours || 0}h`, icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Chapters Done", value: user?.chaptersCompleted || 0, icon: Target, color: "text-brand-500", bg: "bg-brand-50" },
          { label: "Respect Earned", value: user?.respectPoints || 0, icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.1 }}>
            <Card className="glass-card border-none">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={cn("p-3 rounded-2xl", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-slate-900">Active Goals</h2>
          <Button variant="ghost" className="text-brand-600 hover:text-brand-700 hover:bg-brand-50">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map((goal, i) => (
            <motion.div key={goal.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 + i * 0.1 }} whileHover={{ y: -4 }} onClick={() => onSelectGoal(goal)} className="cursor-pointer">
              <Card className="glass-card border-none h-full overflow-hidden group">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-brand-50 text-brand-700 border-none px-3 py-1">
                      {goal.topics.length} Topics
                    </Badge>
                    {goal.virtualRoomUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-slate-400 hover:text-brand-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(goal.virtualRoomUrl, "_blank");
                        }}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Room
                      </Button>
                    )}
                  </div>
                  <CardTitle className="text-xl font-serif group-hover:text-brand-600 transition-colors">{goal.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-slate-500 line-clamp-2 text-sm">{goal.description}</p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-slate-500">Progress</span>
                      <span className="text-brand-600">65%</span>
                    </div>
                    <Progress value={65} className="h-2 bg-slate-100" />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex -space-x-2">
                      {goal.members.map((m) => (
                        <Avatar key={m.userId} className="border-2 border-white w-8 h-8">
                          <AvatarImage src={m.user.avatarUrl} />
                          <AvatarFallback>{m.user.name[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                      <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                        +{goal.members.length}
                      </div>
                    </div>
                    <div className="flex items-center text-slate-400 text-sm">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{goal.members.length} members</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
