import React, { useState } from "react";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Target } from "lucide-react";
import { createUser } from "@/lib/api";

interface LoginProps {
  onLogin: (user: User) => void;
  availableUsers: User[];
}

export function Login({ onLogin, availableUsers }: LoginProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    setLoading(true);
    try {
      const newUser = await createUser({ email, name });
      onLogin(newUser);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl shadow-brand-100 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-200 mb-6">
          <Target className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">MindFlow</h1>
        <p className="text-slate-500 mb-8 text-center">Sign in or create an account to track your study goals.</p>

        {availableUsers.length > 0 && (
          <div className="w-full mb-8 space-y-3">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider text-center">Existing Users</p>
            <div className="flex flex-col gap-2">
              {availableUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => onLogin(u)}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:border-brand-300 hover:bg-brand-50 transition-colors w-full text-left"
                >
                  <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                    <AvatarImage src={u.avatarUrl} />
                    <AvatarFallback>{u.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{u.name}</p>
                    <p className="text-xs text-slate-500 truncate">{u.email}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-xs">or create new</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
          </div>
        )}

        <form onSubmit={handleCreateUser} className="w-full space-y-4">
          <div>
            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 transition-all outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 transition-all outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button disabled={loading} type="submit" className="w-full py-6 text-lg bg-slate-900 hover:bg-slate-800 text-white rounded-xl">
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </form>
      </div>
    </div>
  );
}
