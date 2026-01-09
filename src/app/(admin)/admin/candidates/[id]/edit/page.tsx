import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CandidateForm } from "@/components/admin/CandidateForm";

export default async function EditCandidatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: candidate, error } = await supabase
    .from("candidate_profiles")
    .select(`
      *,
      current_company:companies (id, name)
    `)
    .eq("id", id)
    .single();

  if (error || !candidate) {
    notFound();
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href={`/admin/candidates/${id}`}
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Candidate
        </Link>
        <h1 className="text-3xl font-bold text-white font-heading">
          Edit {candidate.first_name} {candidate.last_name}
        </h1>
      </div>

      <CandidateForm candidate={candidate} />
    </div>
  );
}