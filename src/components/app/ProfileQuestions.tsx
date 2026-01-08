"use client";

import Link from "next/link";
import { Target, Lightbulb, Sparkles, Rocket, Check, ChevronRight } from "lucide-react";

interface ProfileQuestionsProps {
  profile: {
    dream_role?: string;
    if_not_working?: string;
    weird_obsession?: string;
    personal_projects?: string;
  };
}

const questions = [
  { key: "dream_role", label: "Dream Role", icon: Target },
  { key: "if_not_working", label: "If Not In Games", icon: Lightbulb },
  { key: "weird_obsession", label: "Weird Obsession", icon: Sparkles },
  { key: "personal_projects", label: "Personal Projects", icon: Rocket },
];

export function ProfileQuestions({ profile }: ProfileQuestionsProps) {
  const answeredCount = questions.filter((q) => !!(profile as any)[q.key]).length;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white font-heading">Profile Questions</h3>
        <span className="text-white/50 text-sm">{answeredCount}/{questions.length}</span>
      </div>
      
      {/* Progress bar */}
      <div className="h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-brand-orange rounded-full transition-all duration-500"
          style={{ width: `${(answeredCount / questions.length) * 100}%` }}
        />
      </div>

      <div className="space-y-2">
        {questions.map((q) => {
          const Icon = q.icon;
          const hasValue = !!(profile as any)[q.key];
          
          return (
            <Link
              key={q.key}
              href={`/profile?edit=${q.key}`}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                hasValue
                  ? "bg-white/5 hover:bg-white/10"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                hasValue ? "bg-green-500/20" : "bg-white/10"
              }`}>
                <Icon className={`w-4 h-4 ${hasValue ? "text-green-500" : "text-white/50"}`} />
              </div>
              <span className={`flex-1 ${hasValue ? "text-white" : "text-white/70"}`}>
                {q.label}
              </span>
              {hasValue ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-white/30" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}