import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";
import { HexagonBackground } from "@/components/marketing/HexagonBackground";
import { GradientBlur } from "@/components/marketing/GradientBlur";
import { ProcessKanban } from "@/components/admin/ProcessKanban";

export default async function ProcessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createClient();

  const { data: process, error } = await supabase
    .from("processes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !process) {
    notFound();
  }

  const { data: candidateProcesses } = await supabase
    .from("candidate_processes")
    .select(`
      *,
      candidate:candidate_profiles(id, first_name, last_name, email, discipline, experience_level),
      feedback:process_feedback(
        *,
        replies:feedback_replies(*)
      )
    `)
    .eq("process_id", id)
    .order("created_at", { ascending: false });

  const { data: allCandidates } = await supabase
    .from("candidate_profiles")
    .select("id, first_name, last_name, email, discipline")
    .order("first_name");

  const existingCandidateIds = candidateProcesses?.map((cp: any) => cp.candidate?.id) || [];
  const availableCandidates = allCandidates?.filter(
    (c) => !existingCandidateIds.includes(c.id)
  ) || [];

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="relative py-12">
        <HexagonBackground />
        <GradientBlur position="top-right" size="lg" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <Link
            href="/admin/processes"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to processes
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white font-heading">
                {process.role_title}
              </h1>
              <p className="text-white/60 mt-2 text-lg">{process.company_name}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-white/50">
                <span>{process.location || "Remote"}</span>
                <span>·</span>
                <span>{process.role_type || "Full-time"}</span>
                {process.salary_range && (
                  <>
                    <span>·</span>
                    <span>{process.salary_range}</span>
                  </>
                )}
                <span>·</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs ${
                    process.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : process.status === "paused"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-white/10 text-white/60"
                  }`}
                >
                  {process.status}
                </span>
              </div>
            </div>
            <Link
              href={`/admin/processes/${id}/edit`}
              className="btn-ghost inline-flex items-center gap-2 text-sm"
            >
              <Settings className="w-4 h-4" />
              Edit
            </Link>
          </div>

          {process.notes && (
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <p className="text-sm text-white/60">{process.notes}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
        <ProcessKanban
          processId={id}
          processTitle={process.role_title}
          companyName={process.company_name}
          candidateProcesses={candidateProcesses || []}
          availableCandidates={availableCandidates}
        />
      </div>
    </div>
  );
}