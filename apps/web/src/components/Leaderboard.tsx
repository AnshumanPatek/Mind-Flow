"use client";

import { motion } from "motion/react";
import { ArrowUp, Flame, Medal, Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LeaderboardEntry } from "@/types";
import { cn } from "@/lib/utils";

export function Leaderboard({ entries = [] }: { entries: LeaderboardEntry[] }) {
  const topThree = entries.slice(0, 3);
  
  return (
    <div className="space-y-8 pb-20">
      <header>
        <h1 className="text-4xl font-serif font-bold text-slate-900">Leaderboard</h1>
        <p className="text-slate-500 mt-2">See who&apos;s leading the pack in your study groups.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-10">
        {topThree[1] && <PodiumPlace entry={topThree[1]} rank={2} delay={0.2} height="h-48" color="bg-slate-200" icon={<Medal className="w-6 h-6 text-slate-500" />} />}
        {topThree[0] && <PodiumPlace entry={topThree[0]} rank={1} delay={0.1} height="h-64" color="bg-yellow-100" icon={<Trophy className="w-8 h-8 text-yellow-600" />} isWinner />}
        {topThree[2] && <PodiumPlace entry={topThree[2]} rank={3} delay={0.3} height="h-40" color="bg-orange-100" icon={<Medal className="w-6 h-6 text-orange-600" />} />}
      </div>

      <Card className="glass-card border-none overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-white/50">
          <div className="grid grid-cols-12 gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-5">Member</div>
            <div className="col-span-2 text-center">Chapters</div>
            <div className="col-span-2 text-center">Hours</div>
            <div className="col-span-2 text-center">Respect</div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.userId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className={cn(
                "grid grid-cols-12 gap-4 p-4 items-center border-b border-slate-50 hover:bg-slate-50/50 transition-colors",
                i === entries.length - 1 && "border-none",
              )}
            >
              <div className="col-span-1 text-center font-bold text-slate-400">{entry.rank}</div>
              <div className="col-span-5 flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={entry.avatarUrl} />
                  <AvatarFallback>{entry.userName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-slate-900">{entry.userName}</p>
                  <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold uppercase">
                    <ArrowUp className="w-3 h-3" />
                    <span>2 spots</span>
                  </div>
                </div>
              </div>
              <div className="col-span-2 text-center font-mono font-bold text-slate-700">{entry.chaptersCompleted}</div>
              <div className="col-span-2 text-center font-mono font-bold text-slate-700">{entry.totalHours}h</div>
              <div className="col-span-2 text-center">
                <Badge className="bg-orange-50 text-orange-600 border-none font-bold">
                  <Flame className="w-3 h-3 mr-1 fill-current" />
                  {entry.respectPoints}
                </Badge>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
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
