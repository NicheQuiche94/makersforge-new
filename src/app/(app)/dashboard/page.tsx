import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { HexagonBackground } from "@/components/marketing/HexagonBackground";
import { GradientBlur } from "@/components/marketing/GradientBlur";
import { ProfileQuestions } from "@/components/app/ProfileQuestions";
import { FeedbackSection } from "@/components/app/FeedbackSection";
import { 
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight
} from "lucide-react";

const STATUSES = [
  { key: "contacted", label: "Contacted" },
  { key: "screening", label: "Screening" },
  { key: "submitted", label: "Submitted" },
  { key: "interviewing", label: "Interviewing" },
  { key: "offer", label: "Offer" },
  { key: "placed", label: "Placed" },
];

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const supabase = await createClient();
  
  const { data: profile } = await supabase
    .from("candidate_profiles")
    .select("*")
    .eq("clerk_id", user.id)
    .single();

  if (!profile?.profile_complete) {
    redirect("/onboarding");
  }

  // Get candidate's active processes with feedback
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
        role_type,
        interview_stages
      ),
      feedback:process_feedback (
        id,
        stage,
        feedback_text,
        is_from_candidate,
        created_at
      )
    `)
    .eq("candidate_id", profile.id)
    .order("updated_at", { ascending: false });

  const activeProcesses = candidateProcesses?.filter(
    (p) => p.status !== "rejected" && p.status !== "withdrawn"
  ) || [];

  // Get status message based on current stage
  function getStatusMessage(status: string): string {
    switch (status) {
      case "contacted":
        return "We've reached out to discuss this opportunity with you.";
      case "screening":
        return "We're reviewing your profile for this role.";
      case "submitted":
        return "Your profile has been submitted to the client.";
      case "interviewing":
        return "You're in the interview process with the client.";
      case "offer":
        return "Congratulations! An offer is being prepared.";
      case "placed":
        return "You've been successfully placed in this role!";
      default:
        return "Your application is being processed.";
    }
  }

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="relative py-12">
        <HexagonBackground />
        <GradientBlur position="top-right" size="lg" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white font-heading">
            Welcome back, {user.firstName || "there"}
          </h1>
          <p className="text-white/60 mt-2">
            Here&apos;s what&apos;s happening with your job search.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Processes Header */}
            <div className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-brand-orange/20 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-brand-orange" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-heading">
                  Your Active Processes
                </h2>
                <p className="text-white/50 text-sm">
                  Track where you are in each opportunity
                </p>
              </div>
            </div>

            {activeProcesses.length === 0 ? (
              <div className="card p-12 text-center">
                <Briefcase className="w-16 h-16 text-white/10 mx-auto mb-4" />
                <p className="text-white/50 mb-2">No active processes yet</p>
                <p className="text-white/30 text-sm">
                  When you&apos;re added to a hiring process, it will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {activeProcesses.map((cp: any) => {
                  const process = cp.process;
                  const currentStatusIndex = STATUSES.findIndex(
                    (s) => s.key === cp.status
                  );
                  const feedback = cp.feedback?.sort(
                    (a: any, b: any) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  ) || [];

                  return (
                    <div
                      key={cp.id}
                      className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                    >
                      {/* Process Header */}
                      <div className="p-6 border-b border-white/10">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-white font-heading">
                              {process?.role_title}
                            </h3>
                            <div className="flex items-center gap-4 mt-2 text-white/50 text-sm">
                              <span className="inline-flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {process?.company_name}
                              </span>
                              {process?.location && (
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {process.location}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right text-white/40 text-xs">
                            Updated {new Date(cp.updated_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Progress Pipeline */}
                      <div className="p-6 border-b border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          {STATUSES.map((status, index) => {
                            const isComplete = index < currentStatusIndex;
                            const isCurrent = index === currentStatusIndex;
                            const isPending = index > currentStatusIndex;

                            return (
                              <div
                                key={status.key}
                                className="flex flex-col items-center flex-1"
                              >
                                <span
                                  className={`text-xs font-medium mb-2 ${
                                    isComplete || isCurrent
                                      ? "text-brand-orange"
                                      : "text-white/30"
                                  }`}
                                >
                                  {status.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Progress Bar */}
                        <div className="flex gap-1">
                          {STATUSES.map((status, index) => {
                            const isComplete = index < currentStatusIndex;
                            const isCurrent = index === currentStatusIndex;

                            return (
                              <div
                                key={status.key}
                                className="flex-1 relative"
                              >
                                <div
                                  className={`h-2 rounded-full transition-all ${
                                    isComplete
                                      ? "bg-brand-orange"
                                      : isCurrent
                                      ? "bg-gradient-to-r from-brand-orange to-brand-orange/50"
                                      : "bg-white/10"
                                  }`}
                                />
                                {isCurrent && (
                                  <div className="absolute -top-1 right-0 w-4 h-4 rounded-full bg-brand-orange border-2 border-brand-black animate-pulse" />
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Status Message */}
                        <p className="text-white/60 text-sm mt-4">
                          {getStatusMessage(cp.status)}
                        </p>

                        {/* Interview stage if applicable */}
                        {cp.status === "interviewing" &&
                          cp.current_interview_stage &&
                          process?.interview_stages && (
                            <div className="mt-3 p-3 bg-brand-orange/10 rounded-lg border border-brand-orange/20">
                              <p className="text-brand-orange text-sm font-medium">
                                Interview Stage {cp.current_interview_stage} of{" "}
                                {process.interview_stages.length}:{" "}
                                {process.interview_stages[
                                  cp.current_interview_stage - 1
                                ] || "Interview"}
                              </p>
                            </div>
                          )}
                      </div>

                      {/* Feedback Section */}
                      <FeedbackSection 
                        candidateProcessId={cp.id}
                        feedback={feedback}
                        candidateId={profile.id}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* About You / Profile Questions */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">
                    About You
                  </h3>
                  <p className="text-white/50 text-xs">
                    {profile.profile_questions_completed || 0}/4 completed
                  </p>
                </div>
              </div>
              <ProfileQuestions profile={profile} />
            </div>

            {/* How It Works */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-white font-heading mb-4">
                How It Works
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Complete your profile</p>
                    <p className="text-white/40 text-xs">
                      Tell us about your experience and what you're looking for.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Circle className="w-4 h-4 text-white/40" />
                  </div>
                  <div>
                    <p className="text-white/60 font-medium text-sm">Get matched</p>
                    <p className="text-white/30 text-xs">
                      We'll connect you with relevant opportunities.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Circle className="w-4 h-4 text-white/40" />
                  </div>
                  <div>
                    <p className="text-white/60 font-medium text-sm">Track progress</p>
                    <p className="text-white/30 text-xs">
                      Follow your applications and receive feedback here.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-white font-heading mb-4">
                Quick Links
              </h3>
              <div className="space-y-2">
                <Link
                  href="/profile"
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <span className="text-white/70">View Profile</span>
                  <ArrowRight className="w-4 h-4 text-white/30" />
                </Link>
                <Link
                  href="/onboarding"
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <span className="text-white/70">Edit Profile</span>
                  <ArrowRight className="w-4 h-4 text-white/30" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}