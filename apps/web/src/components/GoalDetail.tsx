"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  Circle,
  Flame,
  MessageSquare,
  MoreVertical,
  Plus,
  Settings,
  Share2,
  Target,
  Trophy,
  Video,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Goal, Chapter } from "@/types";
import { MOCK_USER } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface GoalDetailProps {
  goal: Goal;
  onBack: () => void;
}

export function GoalDetail({ goal, onBack }: GoalDetailProps) {
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(new Set(["c1", "c2"]));

  const toggleChapter = (chapterId: string) => {
    const newSet = new Set(completedChapters);
    if (newSet.has(chapterId)) newSet.delete(chapterId);
    else newSet.add(chapterId);
    setCompletedChapters(newSet);
  };

  const totalChapters = goal.topics.reduce((acc, t) => acc + t.chapters.length, 0);
  const progressPercent = Math.round((completedChapters.size / totalChapters) * 100);

  return (
    <div className="space-y-8 pb-24">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Dashboard
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-xl border-slate-200"><Share2 className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon" className="rounded-xl border-slate-200"><Settings className="w-4 h-4" /></Button>
        </div>
      </div>

      <section className="relative overflow-hidden rounded-3xl glass-card border-none p-8 md:p-12">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Target className="w-64 h-64 text-brand-500" /></div>
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-brand-500 text-white border-none px-3 py-1">Active</Badge>
            <Badge variant="outline" className="border-brand-200 text-brand-600 bg-white/50">{goal.members.length} Members</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">{goal.title}</h1>
          <p className="text-lg text-slate-600">{goal.description}</p>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            {goal.virtualRoomUrl && (
              <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-6" onClick={() => window.open(goal.virtualRoomUrl, "_blank")}>
                <Video className="w-4 h-4 mr-2" />Join Study Room
              </Button>
            )}
            <Button variant="outline" className="rounded-2xl border-slate-200 px-6"><MessageSquare className="w-4 h-4 mr-2" />Group Chat</Button>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Overall Progress</span>
              <span className="text-2xl font-serif font-bold text-brand-600">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-3 bg-slate-100" />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Leader</p>
              <p className="font-bold text-slate-900">Mike</p>
            </div>
            <Avatar className="w-12 h-12 border-2 border-brand-100">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" />
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-serif font-bold text-slate-900">Curriculum</h2>
          <Accordion defaultValue={["t1"]} className="space-y-4">
            {goal.topics.map((topic) => (
              <AccordionItem key={topic.id} value={topic.id} className="border-none glass-card rounded-2xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-white/50 transition-colors">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 font-bold">{topic.order}</div>
                    <div>
                      <h3 className="font-bold text-slate-900">{topic.title}</h3>
                      <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">{topic.chapters.length} Chapters</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2">
                  <div className="space-y-2">
                    {topic.chapters.map((chapter) => (
                      <ChapterItem key={chapter.id} chapter={chapter} isCompleted={completedChapters.has(chapter.id)} onToggle={() => toggleChapter(chapter.id)} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="space-y-8">
          <section className="glass-card rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl">Study Group</h3>
              <Button variant="ghost" size="icon" className="rounded-full"><Plus className="w-4 h-4" /></Button>
            </div>
            <div className="space-y-4">
              {goal.members.map((member) => (
                <div key={member.userId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.user.avatarUrl} />
                      <AvatarFallback>{member.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{member.user.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{member.role}</p>
                    </div>
                  </div>
                  {member.userId === MOCK_USER.id ? (
                    <Badge className="bg-brand-50 text-brand-600 border-none">You</Badge>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-400 hover:text-orange-500 hover:bg-orange-50">
                            <Flame className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Give Respect</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card rounded-3xl p-6 space-y-6 bg-slate-900 text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl">Leaderboard</h3>
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="space-y-4">
              {[
                { name: "Mike", score: 15, rank: 1, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
                { name: "Anshuman", score: 12, rank: 2, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anshuman" },
                { name: "Sarah", score: 10, rank: 3, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
              ].map((entry) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 w-4">{entry.rank}</span>
                    <Avatar className="w-8 h-8 border border-slate-700"><AvatarImage src={entry.avatar} /></Avatar>
                    <span className="text-sm font-medium">{entry.name}</span>
                  </div>
                  <span className="text-sm font-bold text-brand-400">{entry.score} pts</span>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full text-slate-400 hover:text-white hover:bg-white/10 text-xs">
              View Full Leaderboard
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}

interface ChapterItemProps {
  chapter: Chapter;
  isCompleted: boolean;
  onToggle: () => void;
}

function ChapterItem({ chapter, isCompleted, onToggle }: ChapterItemProps) {
  return (
    <div className={cn("flex items-center justify-between p-3 rounded-xl transition-all group", isCompleted ? "bg-brand-50/50" : "hover:bg-slate-50")}>
      <div className="flex items-center gap-3">
        <button onClick={onToggle} className={cn("transition-colors", isCompleted ? "text-brand-600" : "text-slate-300 group-hover:text-slate-400")}>
          {isCompleted ? <CheckCircle2 className="w-6 h-6 fill-brand-50" /> : <Circle className="w-6 h-6" />}
        </button>
        <h4 className={cn("text-sm font-medium transition-colors", isCompleted ? "text-brand-900" : "text-slate-700")}>{chapter.title}</h4>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-400 hover:text-orange-500 hover:bg-orange-50">
                <Flame className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Respect</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><MoreVertical className="w-4 h-4" /></Button>
      </div>
    </div>
  );
}
