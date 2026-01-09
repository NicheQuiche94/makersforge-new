import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WorkHistoryForm } from "@/components/admin/WorkHistoryForm";

export default async function AddWorkHistoryPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: candidate, error } = await supabase
    .from("candidate_profiles")
    .select("id, first_name, last_name")
    .eq("id", params.id)
    .single();

  if (error || !candidate) {
    notFound();
  }

  return (
    <div className="p-8 max-w-2xl">
      <Link
        href={`/admin/candidates/${params.id}`}
        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {candidate.first_name} {candidate.last_name}
      </Link>

      <h1 className="text-3xl font-bold text-white font-heading mb-2">Add Work History</h1>
      <p className="text-white/60 mb-8">Add a company to this candidate's work history.</p>

      <WorkHistoryForm candidateId={params.id} />
    </div>
  );
}