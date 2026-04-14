import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { createGoal } from "@/lib/api";

interface CreateGoalModalProps {
  user: User;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateGoalModal({ user, onClose, onCreated }: CreateGoalModalProps) {
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
      onCreated();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-serif font-bold mb-6">Create New Goal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-500 mb-1 block">Goal Title</label>
            <input
              type="text"
              placeholder="e.g. Master Next.js"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-500 mb-1 block">Description</label>
            <textarea
              placeholder="What are we trying to achieve?"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 outline-none min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-500 mb-1 block">Virtual Room URL (Optional)</label>
            <input
              type="url"
              placeholder="e.g. https://meet.google.com/xyz"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 outline-none"
              value={roomUrl}
              onChange={(e) => setRoomUrl(e.target.value)}
            />
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 rounded-xl py-6">
              Cancel
            </Button>
            <Button disabled={loading} type="submit" className="flex-1 bg-brand-600 hover:bg-brand-700 text-white rounded-xl py-6">
              {loading ? "Creating..." : "Create Goal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
