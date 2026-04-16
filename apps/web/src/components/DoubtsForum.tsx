"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, MessageCircle, Plus, Send, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/types";
import { createDoubt, getDoubts, addDoubtReply, resolveDoubt, deleteDoubt } from "@/lib/api";

interface Doubt {
  _id: string;
  title: string;
  description: string;
  status: "open" | "resolved";
  userId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  replies: Array<{
    userId: {
      _id: string;
      name: string;
      email: string;
      avatar?: string;
    };
    message: string;
    createdAt: string;
  }>;
  createdAt: string;
}

interface DoubtsForumProps {
  user: User;
  goalId: string;
  isAdmin: boolean;
}

export function DoubtsForum({ user, goalId, isAdmin }: DoubtsForumProps) {
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedDoubt, setSelectedDoubt] = useState<Doubt | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  
  // Create doubt form
  const [doubtTitle, setDoubtTitle] = useState("");
  const [doubtDescription, setDoubtDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDoubts = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDoubts(goalId);
      setDoubts(data);
    } catch (error) {
      console.error("Failed to fetch doubts:", error);
    } finally {
      setLoading(false);
    }
  }, [goalId]);

  useEffect(() => {
    fetchDoubts();
  }, [fetchDoubts]);

  const handleCreateDoubt = async () => {
    if (!doubtTitle.trim() || !doubtDescription.trim()) return;
    setIsSubmitting(true);
    try {
      await createDoubt({
        title: doubtTitle,
        description: doubtDescription,
        goalId,
        userId: user.id,
      });
      setCreateDialogOpen(false);
      setDoubtTitle("");
      setDoubtDescription("");
      fetchDoubts();
    } catch (error) {
      console.error("Failed to create doubt:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReply = async (doubtId: string) => {
    if (!replyMessage.trim()) return;
    setIsSubmitting(true);
    try {
      await addDoubtReply(doubtId, {
        userId: user.id,
        message: replyMessage,
      });
      setReplyMessage("");
      fetchDoubts();
    } catch (error) {
      console.error("Failed to add reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolve = async (doubtId: string) => {
    try {
      await resolveDoubt(doubtId);
      fetchDoubts();
    } catch (error) {
      console.error("Failed to resolve doubt:", error);
    }
  };

  const handleDelete = async (doubtId: string) => {
    if (!confirm("Are you sure you want to delete this doubt?")) return;
    try {
      await deleteDoubt(doubtId);
      setSelectedDoubt(null);
      fetchDoubts();
    } catch (error) {
      console.error("Failed to delete doubt:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-slate-500">Loading doubts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">Doubts & Questions</h2>
          <p className="text-sm text-slate-500 mt-1">Ask questions and help each other learn</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" />
          Ask Question
        </Button>
      </div>

      <div className="space-y-4">
        {doubts.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center">
            <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No doubts yet</h3>
            <p className="text-slate-500 mb-6">Be the first to ask a question!</p>
            <Button onClick={() => setCreateDialogOpen(true)} variant="outline" className="rounded-xl">
              Ask Question
            </Button>
          </div>
        ) : (
          doubts.map((doubt) => (
            <div key={doubt._id} className="glass-card rounded-3xl p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{doubt.title}</h3>
                    <Badge className={doubt.status === "resolved" ? "bg-green-50 text-green-700 border-green-200" : "bg-orange-50 text-orange-700 border-orange-200"}>
                      {doubt.status === "resolved" ? "Resolved" : "Open"}
                    </Badge>
                  </div>
                  <p className="text-slate-600 mb-3">{doubt.description}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={doubt.userId.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doubt.userId.name}`} />
                      <AvatarFallback>{doubt.userId.name[0]}</AvatarFallback>
                    </Avatar>
                    <span>{doubt.userId.name}</span>
                    <span>•</span>
                    <span>{new Date(doubt.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doubt.status === "open" && (isAdmin || doubt.userId._id === user.id) && (
                    <Button size="sm" variant="ghost" onClick={() => handleResolve(doubt._id)} className="text-green-600 hover:text-green-700 hover:bg-green-50">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Resolve
                    </Button>
                  )}
                  {(isAdmin || doubt.userId._id === user.id) && (
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(doubt._id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {doubt.replies.length > 0 && (
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  {doubt.replies.map((reply, idx) => (
                    <div key={idx} className="flex gap-3 bg-slate-50/50 rounded-xl p-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={reply.userId.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.userId.name}`} />
                        <AvatarFallback>{reply.userId.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-slate-900">{reply.userId.name}</span>
                          <span className="text-xs text-slate-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-slate-600">{reply.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {doubt.status === "open" && (
                <div className="flex gap-2 pt-2">
                  <Input
                    placeholder="Write a reply..."
                    value={selectedDoubt?._id === doubt._id ? replyMessage : ""}
                    onChange={(e) => {
                      setSelectedDoubt(doubt);
                      setReplyMessage(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAddReply(doubt._id);
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleAddReply(doubt._id)}
                    disabled={!replyMessage.trim() || isSubmitting}
                    className="bg-brand-600 hover:bg-brand-700 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Doubt Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Ask a Question</DialogTitle>
            <DialogDescription className="text-slate-500">
              Post your doubt or question for the study group
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="doubt-title" className="text-slate-700">Question Title *</Label>
              <Input
                id="doubt-title"
                placeholder="e.g., How does process scheduling work?"
                value={doubtTitle}
                onChange={(e) => setDoubtTitle(e.target.value)}
                className="border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doubt-description" className="text-slate-700">Description *</Label>
              <Textarea
                id="doubt-description"
                placeholder="Explain your question in detail..."
                value={doubtDescription}
                onChange={(e) => setDoubtDescription(e.target.value)}
                className="border-slate-200 min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setCreateDialogOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateDoubt}
              disabled={!doubtTitle.trim() || !doubtDescription.trim() || isSubmitting}
              className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl"
            >
              {isSubmitting ? "Posting..." : "Post Question"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
