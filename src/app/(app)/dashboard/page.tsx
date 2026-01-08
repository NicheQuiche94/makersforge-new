import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { HexagonBackground } from "@/components/marketing/HexagonBackground";
import { GradientBlur } from "@/components/marketing/GradientBlur";
import { ProfileQuestions } from "@/components/app/ProfileQuestions";
import { 
  Phone, 
  FileText, 
  Send, 
  Users, 
  Gift, 
  Star,
  MessageSquare,
  ArrowRight,
  Briefcase
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
        created_at
      )
    `)
    .eq("candidate_id", profile.id)
    .order("updated_at", { ascending: false });

  const activeProcesses = candidateProcesses?.filter(
    (p) => p.status !== "rejected" && p.status !== "withdrawn"
  ) || [];

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
            {/* Active Processes */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white font-heading">
                  Your Processes
                </h2>
                <span className="text-white/50 text-sm">
                  {activeProcesses.length} active
                </span>
              </div>

              {activeProcesses.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/50 mb-2">No active processes yet</p>
                  <p className="text-white/30 text-sm">
                    When you&apos;re added to a hiring process, it will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeProcesses.map((cp: any) => {
                    const process = cp.process;
                    const currentStatusIndex = STATUSES.findIndex(
                      (s) => s.key === cp.status
                    );
                    const latestFeedback = cp.feedback?.sort(
                      (a: any, b: any) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                    )[0];

                    return (
                      <div
                        key={cp.id}
                        className="bg-white/5 border border-white/10 rounded-xl p-5"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-white">
                              {process?.role_title}
                            </h3>
                            <p className="text-white/60 text-sm">
                              {process?.company_name}
                              {process?.location && ` · ${process.location}`}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              cp.status === "placed"
                                ? "bg-green-500/20 text-green-400"
                                : cp.status === "offer"
                                ? "bg-brand-orange/20 text-brand-orange"
                                : "bg-white/10 text-white/70"
                            }`}
                          >
                            {STATUSES.find((s) => s.key === cp.status)?.label ||
                              cp.status}
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="flex gap-1 mb-4">
                          {STATUSES.map((status, index) => (
                            <div
                              key={status.key}
                              className={`h-1.5 flex-1 rounded-full ${
                                index <= currentStatusIndex
                                  ? "bg-brand-orange"
                                  : "bg-white/10"
                              }`}
                            />
                          ))}
                        </div>

                        {/* Interview stage if applicable */}
                        {cp.status === "interviewing" &&
                          cp.current_interview_stage &&
                          process?.interview_stages && (
                            <p className="text-white/50 text-sm mb-3">
                              Stage: {cp.current_interview_stage} of{" "}
                              {process.interview_stages.length} (
                              {process.interview_stages[
                                cp.current_interview_stage - 1
                              ] || "Interview"}
                              )
                            </p>
                          )}

                        {/* Latest feedback */}
                        {latestFeedback && (
                          <div className="bg-white/5 rounded-lg p-3 mt-3">
                            <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                              <MessageSquare className="w-3 h-3" />
                              Latest feedback
                            </div>
                            <p className="text-white/80 text-sm">
                              {latestFeedback.feedback_text}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Questions */}
            <ProfileQuestions profile={profile} />

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