import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CandidateForm } from "@/components/admin/CandidateForm";

export default async function EditCandidatePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: candidate, error } = await supabase
    .from("candidate_profiles")
    .select(`
      *,
      current_company:companies (id, name)
    `)
    .eq("id", params.id)
    .single();

  if (error || !candidate) {
    notFound();
  }

  return (
    <div className="p-8 max-w-4xl">
      <Link
        href={`/admin/candidates/${params.id}`}
        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Candidate
      </Link>

      <h1 className="text-3xl font-bold text-white font-heading mb-2">Edit Candidate</h1>
      <p className="text-white/60 mb-8">Update candidate information.</p>

      <CandidateForm candidate={candidate} />
    </div>
  );
}