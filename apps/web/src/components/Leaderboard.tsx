"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowUp, Flame, Medal, Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LeaderboardEntry, Goal } from "@/types";
import { cn } from "@/lib/utils";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  goals: Goal[];
  onGoalChange: (goalId: string) => void;
}

export function Leaderboard({ entries = [], goals = [], onGoalChange }: LeaderboardProps) {
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0]?.id || "");
  
  React.useEffect(() => {
    if (goals.length > 0 && !selectedGoalId) {
      setSelectedGoalId(goals[0].id);
    }
  }, [goals, selectedGoalId]);

  const handleGoalChange = (goalId: string) => {
    setSelectedGoalId(goalId);
    onGoalChange(goalId);
  };

  const topThree = entries.slice(0, 3);
  
  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">Leaderboard</h1>
          <p className="text-slate-500 mt-2">See who&apos;s leading the pack in your study groups.</p>
        </div>
        {goals.length > 1 && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-slate-600">Goal:</label>
            <select
              value={selectedGoalId}
              onChange={(e) => handleGoalChange(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </header>

      {entries.length === 0 ? (
        <Card className="glass-card border-none p-12 text-center">
          <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No members yet</h3>
          <p className="text-slate-500">Add members to your goal to see the leaderboard!</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-10">
        {topThree[1] && <PodiumPlace entry={topThree[1]} rank={2} delay={0.2} height="h-48" color="bg-slate-200" icon={<Medal className="w-6 h-6 text-slate-500" />} />}
        {topThree[0] && <PodiumPlace entry={topThree[0]} rank={1} delay={0.1} height="h-64" color="bg-yellow-100" icon={<Trophy className="w-8 h-8 text-yellow-600" />} isWinner />}
        {topThree[2] && <PodiumPlace entry={topThree[2]} rank={3} delay={0.3} height="h-40" color="bg-orange-100" icon={<Medal className="w-6 h-6 text-orange-600" />} />}
      </div>

      <Card className="glass-card border-none overflow-hidden">
        <div className="w-full">
          <table className="w-full text-left">
            <thead className="bg-white/50 border-b border-slate-100">
              <tr className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                <th className="py-4 px-4 text-center w-20">Rank</th>
                <th className="py-4 px-4">Member</th>
                <th className="py-4 px-4 text-center w-32">Chapters</th>
                <th className="py-4 px-4 text-center w-32">Hours</th>
                <th className="py-4 px-4 text-center w-32">Respect</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <motion.tr
                  key={entry.userId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className={cn(
                    "hover:bg-slate-50/50 transition-colors border-b border-slate-50",
                    i === entries.length - 1 && "border-none",
                  )}
                >
                  <td className="py-4 px-4 text-center font-bold text-slate-400">
                    {entry.rank}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={entry.avatarUrl} />
                        <AvatarFallback>{entry.userName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-slate-900">{entry.userName}</p>
                        <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold uppercase mt-0.5">
                          <ArrowUp className="w-3 h-3" />
                          <span>2 spots</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center font-mono font-bold text-slate-700">
                    {entry.chaptersCompleted}
                  </td>
                  <td className="py-4 px-4 text-center font-mono font-bold text-slate-700">
                    {entry.totalHours}h
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Badge className="bg-orange-50 text-orange-600 border-none font-bold inline-flex">
                      <Flame className="w-3 h-3 mr-1 fill-current" />
                      {entry.respectPoints}
                    </Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
        </>
      )}
    </div>
  );
}

function PodiumPlace({
  entry,
  rank,
  delay,
  height,
  color,
  icon,
  isWinner,
}: {
  entry: LeaderboardEntry;
  rank: number;
  delay: number;
  height: string;
  color: string;
  icon: React.ReactNode;
  isWinner?: boolean;
}) {
  return (
    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay, duration: 0.6, ease: "easeOut" }} className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className={cn("border-4", isWinner ? "w-24 h-24 border-yellow-400 shadow-xl shadow-yellow-200" : "w-20 h-20 border-white shadow-lg")}>
          <AvatarImage src={entry.avatarUrl} />
          <AvatarFallback>{entry.userName[0]}</AvatarFallback>
        </Avatar>
        <div className={cn("absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white font-bold text-xs", isWinner ? "bg-yellow-400 text-yellow-900" : "bg-slate-200 text-slate-600")}>
          {rank}
        </div>
      </div>
      <div className="text-center">
        <p className="font-serif font-bold text-slate-900">{entry.userName}</p>
        <p className="text-xs font-bold text-brand-600 uppercase tracking-widest">{entry.chaptersCompleted} Chapters</p>
      </div>
      <div className={cn("w-full rounded-t-3xl flex flex-col items-center justify-start pt-6 gap-2 shadow-inner", color, height)}>
        {icon}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-slate-500 uppercase">Respect</span>
          <span className="text-xl font-bold text-slate-900">{entry.respectPoints}</span>
        </div>
      </div>
    </motion.div>
  );
}
