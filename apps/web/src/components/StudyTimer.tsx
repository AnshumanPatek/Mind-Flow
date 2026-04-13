"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Maximize2, Minimize2, Pause, Play, Square, Timer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StudyTimerProps {
  goalTitle?: string;
  onComplete?: (durationMinutes: number) => void;
}

export function StudyTimer({ goalTitle, onComplete }: StudyTimerProps) {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPaused]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs}:` : ""}${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handleStop = () => {
    if (time > 0 && onComplete) onComplete(Math.ceil(time / 60));
    setIsActive(false);
    setIsPaused(false);
    setTime(0);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-6 right-6 z-50">
        <Card className={cn("glass-card overflow-hidden transition-all duration-300 shadow-2xl", isExpanded ? "w-80" : "w-auto")}>
          <div className="p-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors", isActive ? "bg-brand-500 text-white animate-pulse" : "bg-slate-100 text-slate-500")}>
                <Timer className="w-5 h-5" />
              </div>
              {isExpanded && (
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {isActive ? "Session in Progress" : "Ready to Study"}
                  </span>
                  <span className="text-sm font-bold text-slate-900 truncate max-w-[150px]">
                    {goalTitle || "General Session"}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <div className="text-xl font-mono font-bold text-slate-900 mr-2">{formatTime(time)}</div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-600" onClick={() => setIsVisible(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {isExpanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-center gap-3">
                {!isActive ? (
                  <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-xl" onClick={handleStart}>
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    Start Session
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="flex-1 rounded-xl border-slate-200" onClick={() => setIsPaused(!isPaused)}>
                      {isPaused ? <><Play className="w-4 h-4 mr-2 fill-current" /> Resume</> : <><Pause className="w-4 h-4 mr-2 fill-current" /> Pause</>}
                    </Button>
                    <Button variant="destructive" className="flex-1 rounded-xl" onClick={handleStop}>
                      <Square className="w-4 h-4 mr-2 fill-current" />
                      Stop
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
