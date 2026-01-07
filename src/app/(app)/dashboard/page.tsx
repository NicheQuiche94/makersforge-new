"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { 
  ArrowRight, 
  Loader2, 
  Check, 
  Phone, 
  FileText, 
  Send, 
  Users, 
  Gift, 
  Star,
  Sparkles,
  Target,
  Lightbulb,
  Rocket,
  MessageCircle,
  Calendar,
  ChevronRight
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { HexagonBackgroundSubtle } from "@/components/app/HexagonBackgroundSubtle";
import { GradientBlur } from "@/components/marketing/GradientBlur";

const PROCESS_STAGES = [
  { id: "contacted", label: "Contacted", icon: Phone },
  { id: "screening", label: "Screening", icon: FileText },
  { id: "submitted", label: "Submitted", icon: Send },
  { id: "interviewing", label: "Interviewing", icon: Users },
  { id: "offer", label: "Offer", icon: Gift },
  { id: "placed", label: "Placed", icon: Star },
];

const PROFILE_QUESTIONS = [
  { 
    id: "dream_role", 
    label: "Dream Role", 
    icon: Target,
    description: "What's your ideal next role?",
    placeholder: "Describe your dream position..."
  },
  { 
    id: "if_not_working", 
    label: "If Not In Games", 
    icon: Lightbulb,
    description: "What would you do if not in games?",
    placeholder: "Another industry, hobby, passion..."
  },
  { 
    id: "weird_obsession", 
    label: "Weird Obsession", 
    icon: Sparkles,
    description: "What's something you're weirdly passionate about?",
    placeholder: "That thing you can't stop talking about..."
  },
  { 
    id: "personal_projects", 
    label: "Personal Projects", 
    icon: Rocket,
    description: "Any side projects or games you're working on?",
    placeholder: "Game jams, mods, indie projects..."
  },
];

interface CandidateProcess {
  id: string;
  status: string;
  current_interview_stage: string;
  feedback_received: boolean;
  process: {
    role_title: string;
    company_name: string;
    location: string;
    interview_stages: string[];
  };
}

interface Profile {
  id: string;
  clerk_id: string;
  first_name: string;
  discipline: string;
  speciality: string;
  experience_level: string;
  looking_status: string;
  profile_complete: boolean;
  dream_role?: string;
  if_not_working?: string;
  weird_obsession?: string;
  personal_projects?: string;
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [processes, setProcesses] = useState<CandidateProcess[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [questionValue, setQuestionValue] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      loadData();
    }
  }, [isLoaded, user]);

  async function loadData() {
    if (!user) return;

    // Load profile
    const { data: profileData } = await supabase
      .from("candidate_profiles")
      .select("*")
      .eq("clerk_id", user.id)
      .single();

    if (profileData) {
      setProfile(profileData);

      // Load active processes - join with processes table
      const { data: processData } = await supabase
        .from("candidate_processes")
        .select(`
          id,
          status,
          current_interview_stage,
          feedback_received,
          process:processes (
            role_title,
            company_name,
            location,
            interview_stages
          )
        `)
        .eq("candidate_id", profileData.id)
        .neq("status", "rejected")
        .neq("status", "withdrawn")
        .order("updated_at", { ascending: false });

      if (processData) {
        setProcesses(processData as any);
      }
    }

    setLoading(false);
  }

  async function saveProfileQuestion(questionId: string, value: string) {
    if (!user || !profile) return;
    setSaving(true);

    await supabase
      .from("candidate_profiles")
      .update({ [questionId]: value, updated_at: new Date().toISOString() })
      .eq("clerk_id", user.id);

    setProfile({ ...profile, [questionId]: value });
    setEditingQuestion(null);
    setQuestionValue("");
    setSaving(false);
  }

  const completedQuestions = PROFILE_QUESTIONS.filter(
    q => profile && profile[q.id as keyof Profile]
  ).length;

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  if (!profile?.profile_complete) {
    return (
      <div className="min-h-screen bg-brand-black">
        <div className="relative py-12 min-h-screen">
          <HexagonBackgroundSubtle />
          <GradientBlur position="top-right" size="lg" color="orange" intensity="low" />
          <div className="relative mx-auto max-w-3xl px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white font-heading mb-2">
              Welcome, {user?.firstName || "there"}
            </h1>
            <p className="text-white/60 mb-8">
              Let's get your profile set up so we can start finding you opportunities.
            </p>

            <div className="card-highlight p-8">
              <h2 className="text-2xl font-bold text-white font-heading mb-4">
                Complete your profile
              </h2>
              <p className="text-white/60 mb-6">
                Tell us about your experience and what you're looking for so we can match you with the right opportunities at mobile gaming studios.
              </p>
              <Link
                href="/onboarding"
                className="btn-primary inline-flex items-center gap-2"
              >
                Get started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="mt-12">
              <h2 className="text-xl font-bold text-white font-heading mb-6">
                How it works
              </h2>
              <div className="grid gap-4">
                <div className="card p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-orange font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Complete your profile</h3>
                    <p className="text-white/60 text-sm">
                      Share your experience, skills, and what you're looking for in your next role.
                    </p>
                  </div>
                </div>
                <div className="card p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-orange font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">We find the right match</h3>
                    <p className="text-white/60 text-sm">
                      We connect you with opportunities at funded mobile gaming studios that match your goals.
                    </p>
                  </div>
                </div>
                <div className="card p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-orange font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Track your progress</h3>
                    <p className="text-white/60 text-sm">
                      Follow your application journey and receive feedback at every stage.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="relative py-12">
        <HexagonBackgroundSubtle />
        <GradientBlur position="top-right" size="lg" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white font-heading mb-2">
              Welcome back, {profile.first_name || user?.firstName || "there"}
            </h1>
            <p className="text-white/60">
              {processes.length > 0 
                ? `You have ${processes.length} active ${processes.length === 1 ? 'process' : 'processes'}`
                : "We're looking for the perfect match for you"
              }
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {processes.length > 0 ? (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-white font-heading">
                    Active Processes
                  </h2>
                  {processes.map((cp) => (
                    <ProcessCard key={cp.id} candidateProcess={cp} />
                  ))}
                </div>
              ) : (
                <div className="card p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-brand-orange/20 flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-brand-orange" />
                  </div>
                  <h2 className="text-xl font-bold text-white font-heading mb-2">
                    No active processes yet
                  </h2>
                  <p className="text-white/60 mb-4 max-w-md mx-auto">
                    We're reviewing your profile and searching for opportunities that match your experience and goals. We'll reach out when we find the right fit.
                  </p>
                  <p className="text-sm text-white/40">
                    In the meantime, complete your profile questions below to help us understand you better.
                  </p>
                </div>
              )}

              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white font-heading">
                    Your Profile
                  </h2>
                  <Link 
                    href="/profile" 
                    className="text-brand-orange hover:text-brand-orange-light text-sm flex items-center gap-1"
                  >
                    View full profile
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/50">Discipline</span>
                    <p className="text-white">{profile.discipline}</p>
                  </div>
                  <div>
                    <span className="text-white/50">Speciality</span>
                    <p className="text-white">{profile.speciality || "—"}</p>
                  </div>
                  <div>
                    <span className="text-white/50">Experience</span>
                    <p className="text-white">{profile.experience_level}</p>
                  </div>
                  <div>
                    <span className="text-white/50">Status</span>
                    <p className="text-white">
                      {profile.looking_status === "yes" 
                        ? "Actively looking" 
                        : profile.looking_status === "passive" 
                        ? "Open to opportunities" 
                        : "Not looking"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card-highlight p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white font-heading">
                    Profile Questions
                  </h2>
                  <span className="text-sm text-white/50">
                    {completedQuestions}/{PROFILE_QUESTIONS.length}
                  </span>
                </div>
                
                <div className="w-full bg-white/10 rounded-full h-2 mb-6">
                  <div 
                    className="bg-brand-orange h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedQuestions / PROFILE_QUESTIONS.length) * 100}%` }}
                  />
                </div>

                <div className="space-y-3">
                  {PROFILE_QUESTIONS.map((question) => {
                    const isComplete = profile && profile[question.id as keyof Profile];
                    const isEditing = editingQuestion === question.id;
                    const Icon = question.icon;

                    return (
                      <div key={question.id}>
                        {isEditing ? (
                          <div className="p-4 bg-white/5 rounded-lg border border-brand-orange/30">
                            <label className="block text-sm font-medium text-white mb-2">
                              {question.description}
                            </label>
                            <textarea
                              value={questionValue}
                              onChange={(e) => setQuestionValue(e.target.value)}
                              placeholder={question.placeholder}
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-brand-orange/50 resize-none"
                              rows={3}
                              autoFocus
                            />
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => saveProfileQuestion(question.id, questionValue)}
                                disabled={saving || !questionValue.trim()}
                                className="btn-primary text-sm py-2 px-4 disabled:opacity-50"
                              >
                                {saving ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  "Save"
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setEditingQuestion(null);
                                  setQuestionValue("");
                                }}
                                className="btn-ghost text-sm py-2 px-4"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingQuestion(question.id);
                              setQuestionValue(
                                (profile?.[question.id as keyof Profile] as string) || ""
                              );
                            }}
                            className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-colors text-left ${
                              isComplete
                                ? "bg-brand-orange/10 border-brand-orange/30 hover:border-brand-orange/50"
                                : "bg-white/5 border-white/10 hover:border-white/30"
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isComplete ? "bg-brand-orange/30" : "bg-white/10"
                            }`}>
                              {isComplete ? (
                                <Check className="w-4 h-4 text-brand-orange" />
                              ) : (
                                <Icon className="w-4 h-4 text-white/50" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className={`block text-sm font-medium ${
                                isComplete ? "text-white" : "text-white/70"
                              }`}>
                                {question.label}
                              </span>
                              {isComplete && (
                                <p className="text-xs text-white/50 truncate">
                                  {profile?.[question.id as keyof Profile] as string}
                                </p>
                              )}
                            </div>
                            <ChevronRight className={`w-4 h-4 flex-shrink-0 ${
                              isComplete ? "text-brand-orange" : "text-white/30"
                            }`} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-lg font-bold text-white font-heading mb-4">
                  How it works
                </h2>
                <div className="space-y-4 text-sm">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-orange text-xs font-bold">1</span>
                    </div>
                    <p className="text-white/60">We match you with relevant opportunities</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-orange text-xs font-bold">2</span>
                    </div>
                    <p className="text-white/60">Track your progress at each stage</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-orange text-xs font-bold">3</span>
                    </div>
                    <p className="text-white/60">Receive feedback throughout the process</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProcessCard({ candidateProcess }: { candidateProcess: CandidateProcess }) {
  const process = candidateProcess.process;
  const currentStage = candidateProcess.current_interview_stage || candidateProcess.status;
  const currentStageIndex = PROCESS_STAGES.findIndex(s => s.id === currentStage);

  return (
    <div className="card-highlight p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-white text-lg">{process?.role_title || "Role"}</h3>
          <p className="text-white/60 text-sm">
            {process?.company_name || "Company"} • {process?.location || "Location TBC"}
          </p>
        </div>
        {candidateProcess.feedback_received && (
          <div className="flex items-center gap-2 bg-brand-orange/20 text-brand-orange px-3 py-1.5 rounded-full text-sm">
            <MessageCircle className="w-4 h-4" />
            Feedback Received
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 mb-4">
        {PROCESS_STAGES.map((stage, index) => {
          const isPast = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;

          return (
            <div key={stage.id} className="flex-1">
              <div 
                className={`h-2 rounded-full transition-colors ${
                  isPast || isCurrent ? "bg-brand-orange" : "bg-white/10"
                }`}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-between text-xs">
        {PROCESS_STAGES.map((stage, index) => {
          const isPast = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const Icon = stage.icon;

          return (
            <div 
              key={stage.id} 
              className={`flex flex-col items-center ${
                isCurrent ? "text-brand-orange" : isPast ? "text-white/70" : "text-white/30"
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="hidden sm:block">{stage.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}