"use client";

import { useEffect, useRef, useState } from "react";

import { Maximize2, Minimize2, Pause, Play, Square, Timer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StudyTimerProps {
  goalTitle?: string;
  onComplete?: (durationMinutes: number) => void;
  onNavigate?: () => void;
}

export function StudyTimer({ goalTitle, onComplete, onNavigate }: StudyTimerProps) {
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
    <div className="relative z-40">
      <Card className={cn("glass-card transition-all duration-300 shadow-sm border border-slate-200/50 flex items-center", isExpanded ? "w-96" : "w-80")}>
        <div 
          className="p-2 px-5 flex w-full items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors h-14 rounded-xl"
          onClick={() => {
            if (onNavigate) onNavigate();
          }}
        >
          <div className="flex items-center gap-4">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors", isActive ? "bg-brand-500 text-white animate-pulse" : "bg-slate-100 text-slate-500")}>
              <Timer className="w-5 h-5" />
            </div>
            {isExpanded && (
              <span className="text-base font-medium text-slate-900 truncate max-w-[120px]">
                {goalTitle || "General Session"}
              </span>
            )}
            <div className="text-xl font-mono font-bold text-slate-700 w-20 text-center tracking-wider">
              {formatTime(time)}
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/50" 
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            {!isActive && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md text-brand-600 hover:bg-brand-100 hover:text-brand-700"
                onClick={(e) => { e.stopPropagation(); handleStart(); }}
              >
                <Play className="w-4 h-4 fill-current" />
              </Button>
            )}
            {isActive && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md text-slate-500 hover:bg-slate-200"
                onClick={(e) => { e.stopPropagation(); setIsPaused(!isPaused); }}
              >
                {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
              </Button>
            )}
            {isActive && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={(e) => { e.stopPropagation(); handleStop(); }}
              >
                <Square className="w-4 h-4 fill-current" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
