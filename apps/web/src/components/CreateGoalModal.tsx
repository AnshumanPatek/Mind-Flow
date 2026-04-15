import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/types";
import { createGoal } from "@/lib/api";

interface CreateGoalModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateGoalModal({ user, isOpen, onClose, onCreated }: CreateGoalModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roomUrl, setRoomUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setLoading(true);
    try {
      await createGoal({
        title,
        description,
        adminId: user.id,
        virtualRoomUrl: roomUrl || undefined,
      });
      setTitle("");
      setDescription("");
      setRoomUrl("");
      onCreated();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Create New Goal</DialogTitle>
          <DialogDescription className="text-slate-500">
            Set up a new study goal to track your progress and collaborate with others
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="goal-title" className="text-slate-700">Goal Title *</Label>
              <Input
                id="goal-title"
                type="text"
                placeholder="e.g., Master Next.js, UGC-NET Preparation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-description" className="text-slate-700">Description</Label>
              <Textarea
                id="goal-description"
                placeholder="What are we trying to achieve?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-slate-200 min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room-url" className="text-slate-700">Virtual Room URL (Optional)</Label>
              <Input
                id="room-url"
                type="url"
                placeholder="e.g., https://meet.google.com/xyz"
                value={roomUrl}
                onChange={(e) => setRoomUrl(e.target.value)}
                className="border-slate-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={loading || !title.trim()}
              className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl"
            >
              {loading ? "Creating..." : "Create Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
