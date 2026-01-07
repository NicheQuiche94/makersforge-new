import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { HexagonBackground } from "@/components/marketing/HexagonBackground";
import { GradientBlur } from "@/components/marketing/GradientBlur";
import { FeedbackThread } from "@/components/app/FeedbackThread";
import { 
  Phone, 
  FileText, 
  Send, 
  Users, 
  Gift, 
  Star,
  MessageSquare,
  Target,
  Lightbulb,
  Sparkles,
  Rocket,
  ChevronRight
} from "lucide-react";

const STATUSES = [
  { key: "contacted", label: "Contacted", icon: Phone },
  { key: "screening", label: "Screening", icon: FileText },
  { key: "submitted", label: "Submitted", icon: Send },
  { key: "interviewing", label: "Interviewing", icon: Users },
  { key: "offer", label: "Offer", icon: Gift },
  { key: "placed", label: "Placed", icon: Star },
];

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const supabase = createClient();
  
  const { data: profile } = await supabase
    .from("candidate_profiles")
    .select("*")
    .eq("clerk_id", user.id)
    .single();

  if (!profile?.profile_complete) {
    redirect("/onboarding");
  }

  // Get candidate's active processes with feedback AND replies
  const { data: candidateProcesses } = await supabase
    .from("candidate_processes")
    .select(`
      id,
      status,
      current_interview_stage,
      feedback_received,
      created_at,
      updated_at,
      process:processes (
        id,
        role_title,
        company_name,
        location,
        role_type
      ),
      feedback:process_feedback (
        id,
        stage,
        feedback_text,
        created_at,
        replies:feedback_replies (
          id,
          message,
          is_from_admin,
          created_at
        )
      )
    `)
    .eq("candidate_id", profile.id)
    .order("updated_at", { ascending: false });

  const activeProcesses = candidateProcesses || [];

  // Calculate profile questions completion
  const profileQuestions = [
    { key: "dream_role", label: "Dream Role", icon: Target, value: profile.dream_role },
    { key: "if_not_working", label: "If Not In Games", icon: Lightbulb, value: profile.if_not_working },
    { key: "weird_obsession", label: "Weird Obsession", icon: Sparkles, value: profile.weird_obsession },
    { key: "personal_projects", label: "Personal Projects", icon: Rocket, value: profile.personal_projects },
  ];
  const completedQuestions = profileQuestions.filter(q => q.value).length;

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="relative py-12">
        <HexagonBackground />
        <GradientBlur position="top-right" size="lg" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white font-heading">
            Welcome back, {profile.first_name}
          </h1>
          <p className="text-white/60 mt-2">
            {activeProcesses.length > 0 
              ? `You have ${activeProcesses.length} active process${activeProcesses.length > 1 ? 'es' : ''}`
              : "No active processes yet"
            }
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Processes */}
            <div>
              <h2 className="text-xl font-bold text-white font-heading mb-4">
                Active Processes
              </h2>
              
              {activeProcesses.length > 0 ? (
                <div className="space-y-6">
                  {activeProcesses.map((cp: any) => {
                    const currentStatusIndex = STATUSES.findIndex(s => s.key === cp.status);
                    const hasFeedback = cp.feedback && cp.feedback.length > 0;
                    const totalMessages = cp.feedback?.reduce((acc: number, fb: any) => 
                      acc + 1 + (fb.replies?.length || 0), 0) || 0;
                    
                    return (
                      <div key={cp.id} className="card p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-white">
                              {cp.process?.role_title}
                            </h3>
                            <p className="text-white/60 text-sm">
                              {cp.process?.company_name} • {cp.process?.location || "Remote"}
                            </p>
                          </div>
                          {hasFeedback && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-orange/20 text-brand-orange text-sm rounded-full">
                              <MessageSquare className="w-4 h-4" />
                              {totalMessages} messages
                            </span>
                          )}
                        </div>

                        {/* Status Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            {STATUSES.map((status, index) => {
                              const Icon = status.icon;
                              const isCompleted = index < currentStatusIndex;
                              const isCurrent = index === currentStatusIndex;
                              
                              return (
                                <div key={status.key} className="flex flex-col items-center flex-1">
                                  <div className={`w-full h-1 ${index === 0 ? 'rounded-l' : ''} ${index === STATUSES.length - 1 ? 'rounded-r' : ''} ${
                                    isCompleted 
                                      ? 'bg-brand-orange' 
                                      : isCurrent 
                                        ? 'bg-brand-orange' 
                                        : 'bg-white/10'
                                  }`} />
                                  <div className={`mt-2 p-2 rounded-lg ${
                                    isCurrent 
                                      ? 'bg-brand-orange/20 text-brand-orange' 
                                      : isCompleted
                                        ? 'text-brand-orange/60'
                                        : 'text-white/30'
                                  }`}>
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <span className={`text-xs mt-1 ${
                                    isCurrent ? 'text-white' : 'text-white/40'
                                  }`}>
                                    {status.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Interview Stage (if in Interviewing) */}
                        {cp.status === "interviewing" && cp.current_interview_stage && (
                          <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-lg p-3 mb-4">
                            <p className="text-sm text-brand-orange">
                              Currently at: <span className="font-semibold">{cp.current_interview_stage} Interview</span>
                            </p>
                          </div>
                        )}

                        {/* Feedback Thread */}
                        <FeedbackThread 
                          feedback={cp.feedback || []} 
                          candidateProcessId={cp.id}
                          candidateName={profile.first_name}
                          candidateEmail={profile.email}
                          roleTitle={cp.process?.role_title || ""}
                          companyName={cp.process?.company_name || ""}
                        />

                        {/* Last updated */}
                        <p className="text-xs text-white/30 mt-4">
                          Updated {new Date(cp.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="card p-8 text-center">
                  <p className="text-white/40 mb-2">No active processes yet</p>
                  <p className="text-white/60 text-sm">
                    When you're matched with opportunities, they'll appear here.
                  </p>
                </div>
              )}
            </div>

            {/* Your Profile Summary */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white font-heading">Your Profile</h2>
                <Link 
                  href="/profile" 
                  className="text-sm text-brand-orange hover:text-brand-orange/80 inline-flex items-center gap-1"
                >
                  View full profile
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-white/50">Discipline</p>
                  <p className="text-white">{profile.discipline || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50">Speciality</p>
                  <p className="text-white">{profile.speciality || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50">Experience</p>
                  <p className="text-white">{profile.experience_level || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50">Status</p>
                  <p className="text-white">
                    {profile.looking_status === "yes"
                      ? "Actively looking"
                      : profile.looking_status === "passive"
                      ? "Open to opportunities"
                      : "Not looking"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Questions */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white font-heading">Profile Questions</h3>
                <span className="text-sm text-white/40">{completedQuestions}/4</span>
              </div>
              
              {/* Progress bar */}
              <div className="h-1 bg-white/10 rounded-full mb-4">
                <div 
                  className="h-full bg-brand-orange rounded-full transition-all"
                  style={{ width: `${(completedQuestions / 4) * 100}%` }}
                />
              </div>

              <div className="space-y-2">
                {profileQuestions.map((question) => {
                  const Icon = question.icon;
                  const isCompleted = !!question.value;
                  
                  return (
                    <Link
                      key={question.key}
                      href="/onboarding"
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isCompleted
                          ? "bg-white/5 text-white/60"
                          : "bg-white/5 hover:bg-white/10 text-white"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isCompleted ? "text-green-400" : "text-white/40"}`} />
                      <span className="flex-1 text-sm">{question.label}</span>
                      {isCompleted ? (
                        <span className="text-xs text-green-400">✓</span>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-white/30" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* How It Works */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-white font-heading mb-4">How It Works</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center text-xs font-bold shrink-0">
                    1
                  </span>
                  <p className="text-sm text-white/60">
                    We match you with relevant opportunities
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center text-xs font-bold shrink-0">
                    2
                  </span>
                  <p className="text-sm text-white/60">
                    Track your progress at each stage
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center text-xs font-bold shrink-0">
                    3
                  </span>
                  <p className="text-sm text-white/60">
                    Receive feedback after each interview
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