"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  Circle,
  Flame,
  MessageSquare,
  Plus,
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Goal, Section, Chapter, User } from "@/types";
import { cn } from "@/lib/utils";
import { giveReaction, updateChapterStatus, createSection, createChapter, createTopic, addGoalMember, getUsers, toggleTopicProgress, getTopicProgress } from "@/lib/api";

interface GoalDetailProps {
  user: User;
  goal: Goal;
  onBack: () => void;
  onRefresh: () => void;
}

export function GoalDetail({ user, goal, onBack, onRefresh }: GoalDetailProps) {
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  
  // Dialog states
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [chapterDialogOpen, setChapterDialogOpen] = useState(false);
  const [topicDialogOpen, setTopicDialogOpen] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  
  // Form states
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionDescription, setSectionDescription] = useState("");
  
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterDescription, setChapterDescription] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [currentChaptersCount, setCurrentChaptersCount] = useState(0);
  
  const [topicTitle, setTopicTitle] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [currentTopicsCount, setCurrentTopicsCount] = useState(0);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Add member states
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  // Fetch available users when component mounts
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        // Filter out users who are already members
        const memberIds = goal.members.map(m => m.userId);
        const nonMembers = users.filter(u => !memberIds.includes(u.id));
        setAvailableUsers(nonMembers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, [goal.members]);

  // Fetch topic progress when component mounts
  React.useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progress = await getTopicProgress(goal.id, user.id);
        const completedIds = progress.map((p: any) => p.topicId);
        setCompletedTopics(new Set(completedIds));
      } catch (error) {
        console.error("Failed to fetch progress:", error);
      }
    };
    fetchProgress();
  }, [goal.id, user.id]);

  const toggleChapter = async (chapterId: string) => {
    const isCompleted = completedTopics.has(chapterId);
    const newStatus = isCompleted ? "PENDING" : "COMPLETED";
    
    // Update local state optimistic UI
    const newSet = new Set(completedTopics);
    if (isCompleted) newSet.delete(chapterId);
    else newSet.add(chapterId);
    setCompletedTopics(newSet);

    // Call API
    await updateChapterStatus(chapterId, newStatus).catch(console.error);
  };

  const handleAddSection = async () => {
    setSectionDialogOpen(true);
  };

  const handleSubmitSection = async () => {
    if (!sectionTitle.trim()) return;
    setIsSubmitting(true);
    try {
      await createSection({ 
        title: sectionTitle, 
        description: sectionDescription,
        goalId: goal.id, 
        order: goal.sections.length + 1 
      });
      setSectionDialogOpen(false);
      setSectionTitle("");
      setSectionDescription("");
      onRefresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddChapter = async (sectionId: string, chaptersCount: number) => {
    setSelectedSectionId(sectionId);
    setCurrentChaptersCount(chaptersCount);
    setChapterDialogOpen(true);
  };

  const handleSubmitChapter = async () => {
    if (!chapterTitle.trim()) return;
    setIsSubmitting(true);
    try {
      await createChapter({ 
        title: chapterTitle,
        sectionId: selectedSectionId, 
        order: currentChaptersCount + 1, 
        status: "PENDING" 
      });
      setChapterDialogOpen(false);
      setChapterTitle("");
      setChapterDescription("");
      onRefresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTopic = async (chapterId: string, topicsCount: number) => {
    setSelectedChapterId(chapterId);
    setCurrentTopicsCount(topicsCount);
    setTopicDialogOpen(true);
  };

  const handleSubmitTopic = async () => {
    if (!topicTitle.trim()) return;
    setIsSubmitting(true);
    try {
      await createTopic({ 
        title: topicTitle,
        description: topicDescription,
        chapterId: selectedChapterId, 
        order: currentTopicsCount + 1 
      });
      setTopicDialogOpen(false);
      setTopicTitle("");
      setTopicDescription("");
      onRefresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId) return;
    setIsSubmitting(true);
    try {
      await addGoalMember(goal.id, selectedUserId, "USER");
      setAddMemberDialogOpen(false);
      setSelectedUserId("");
      onRefresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalChapters = goal.sections.reduce((acc, s) => acc + s.chapters.length, 0);
  const totalTopics = goal.sections.reduce((acc, s) => 
    acc + s.chapters.reduce((chAcc, ch) => chAcc + ch.topics.length, 0), 0
  );
  const progressPercent = totalTopics > 0 ? Math.round((completedTopics.size / totalTopics) * 100) : 0;

  // Find the goal creator/admin
  const goalAdmin = goal.members.find(m => m.role === 'admin') || goal.members[0];
  const leaderName = goalAdmin?.user?.name || user.name;

  return (
    <div className="space-y-8 pb-24">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Dashboard
        </Button>
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
              <p className="font-bold text-slate-900">{leaderName}</p>
            </div>
            <Avatar className="w-12 h-12 border-2 border-brand-100">
              <AvatarImage src={goalAdmin?.user?.avatarUrl || user.avatarUrl} />
              <AvatarFallback>{leaderName[0]}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-serif font-bold text-slate-900">Curriculum</h2>
            <Button variant="outline" size="sm" onClick={handleAddSection}>+ Add Section</Button>
          </div>
          <Accordion defaultValue={goal.sections[0]?.id ? [goal.sections[0].id] : []} className="space-y-4">
            {goal.sections.map((section) => (
              <AccordionItem key={section.id} value={section.id} className="border-none glass-card rounded-2xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-white/50 transition-colors">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 font-bold">{section.order}</div>
                    <div>
                      <h3 className="font-bold text-slate-900">{section.title}</h3>
                      <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">{section.chapters.length} Chapters</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2">
                  <div className="space-y-3">
                    {section.chapters.map((chapter) => (
                      <div key={chapter.id} className="border-l-2 border-brand-200 pl-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-slate-800">{chapter.title}</h4>
                          <Badge variant="outline" className="text-xs">{chapter.topics.length} Topics</Badge>
                        </div>
                        <div className="space-y-1 ml-2">
                          {chapter.topics.map((topic) => (
                            <TopicItem 
                              key={topic.id} 
                              topic={topic}
                              isCompleted={completedTopics.has(topic.id)}
                              onToggle={async () => {
                                try {
                                  await toggleTopicProgress(topic.id, user.id, goal.id);
                                  const newSet = new Set(completedTopics);
                                  if (completedTopics.has(topic.id)) {
                                    newSet.delete(topic.id);
                                  } else {
                                    newSet.add(topic.id);
                                  }
                                  setCompletedTopics(newSet);
                                } catch (error) {
                                  console.error("Failed to toggle progress:", error);
                                }
                              }}
                            />
                          ))}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full text-slate-400 text-xs h-8" 
                            onClick={() => handleAddTopic(chapter.id, chapter.topics.length)}
                          >
                            + Add Topic
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="ghost" 
                      className="w-full text-slate-400" 
                      onClick={() => handleAddChapter(section.id, section.chapters.length)}
                    >
                      + Add Chapter
                    </Button>
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
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-brand-50"
                onClick={() => setAddMemberDialogOpen(true)}
              >
                <Plus className="w-4 h-4" />
              </Button>
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
                  {member.userId === user?.id ? (
                    <Badge className="bg-brand-50 text-brand-600 border-none">You</Badge>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-orange-400 hover:text-orange-500 hover:bg-orange-50"
                            onClick={async () => {
                              try {
                                // Get first section's first chapter's first topic if available
                                const firstSection = goal.sections[0];
                                const firstChapter = firstSection?.chapters[0];
                                const firstTopic = firstChapter?.topics[0];
                                await giveReaction({
                                  type: "🔥",
                                  chapterId: firstChapter?.id || "default",
                                  giverId: user.id,
                                  receiverId: member.userId
                                });
                              } catch(e) { console.error(e) }
                            }}
                          >
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

          <section className="glass-card rounded-3xl p-6 space-y-6 bg-slate-900 text-white hidden">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl">Leaderboard</h3>
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            {/* Kept here but hidden until global goal specific leaderboard is injected fully */}
          </section>
        </div>
      </div>

      {/* Add Section Dialog */}
      <Dialog open={sectionDialogOpen} onOpenChange={setSectionDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Add New Section</DialogTitle>
            <DialogDescription className="text-slate-500">
              Create a new section for your goal (e.g., Operating System, History, Geography)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="section-title" className="text-slate-700">Section Title *</Label>
              <Input
                id="section-title"
                placeholder="e.g., Operating System"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                className="border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="section-description" className="text-slate-700">Description (Optional)</Label>
              <Textarea
                id="section-description"
                placeholder="Brief description of this section..."
                value={sectionDescription}
                onChange={(e) => setSectionDescription(e.target.value)}
                className="border-slate-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setSectionDialogOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitSection}
              disabled={!sectionTitle.trim() || isSubmitting}
              className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl"
            >
              {isSubmitting ? "Creating..." : "Create Section"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Chapter Dialog */}
      <Dialog open={chapterDialogOpen} onOpenChange={setChapterDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Add New Chapter</DialogTitle>
            <DialogDescription className="text-slate-500">
              Create a new chapter within this section
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="chapter-title" className="text-slate-700">Chapter Title *</Label>
              <Input
                id="chapter-title"
                placeholder="e.g., Process Management"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                className="border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chapter-description" className="text-slate-700">Description (Optional)</Label>
              <Textarea
                id="chapter-description"
                placeholder="Brief description of this chapter..."
                value={chapterDescription}
                onChange={(e) => setChapterDescription(e.target.value)}
                className="border-slate-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setChapterDialogOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitChapter}
              disabled={!chapterTitle.trim() || isSubmitting}
              className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl"
            >
              {isSubmitting ? "Creating..." : "Create Chapter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Topic Dialog */}
      <Dialog open={topicDialogOpen} onOpenChange={setTopicDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Add New Topic</DialogTitle>
            <DialogDescription className="text-slate-500">
              Create a new topic within this chapter
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="topic-title" className="text-slate-700">Topic Title *</Label>
              <Input
                id="topic-title"
                placeholder="e.g., Process Scheduling"
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                className="border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic-description" className="text-slate-700">Description (Optional)</Label>
              <Textarea
                id="topic-description"
                placeholder="Brief description of this topic..."
                value={topicDescription}
                onChange={(e) => setTopicDescription(e.target.value)}
                className="border-slate-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setTopicDialogOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitTopic}
              disabled={!topicTitle.trim() || isSubmitting}
              className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl"
            >
              {isSubmitting ? "Creating..." : "Create Topic"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Add Member</DialogTitle>
            <DialogDescription className="text-slate-500">
              Invite someone to join this study goal
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="user-select" className="text-slate-700">Select User *</Label>
              {availableUsers.length > 0 ? (
                <select
                  id="user-select"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                >
                  <option value="">Select a user...</option>
                  {availableUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-slate-500 py-2">All users are already members of this goal.</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setAddMemberDialogOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddMember}
              disabled={!selectedUserId || isSubmitting}
              className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl"
            >
              {isSubmitting ? "Adding..." : "Add Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface TopicItemProps {
  topic: { id: string; title: string; description?: string };
  isCompleted: boolean;
  onToggle: () => void;
}

function TopicItem({ topic, isCompleted, onToggle }: TopicItemProps) {
  return (
    <div className={cn("flex items-center gap-2 p-2 rounded-lg transition-all group", isCompleted ? "bg-brand-50/30" : "hover:bg-slate-50")}>
      <button 
        onClick={onToggle} 
        className={cn("transition-colors flex-shrink-0", isCompleted ? "text-brand-600" : "text-slate-300 group-hover:text-slate-400")}
      >
        {isCompleted ? <CheckCircle2 className="w-5 h-5 fill-brand-50" /> : <Circle className="w-5 h-5" />}
      </button>
      <span className={cn("text-sm transition-colors", isCompleted ? "text-brand-900 line-through" : "text-slate-600")}>{topic.title}</span>
    </div>
  );
}
