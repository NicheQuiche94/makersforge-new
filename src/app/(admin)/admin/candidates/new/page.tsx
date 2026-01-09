import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CandidateForm } from "@/components/admin/CandidateForm";

export default function NewCandidatePage() {
  return (
    <div className="p-8 max-w-4xl">
      <Link
        href="/admin/candidates"
        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Candidates
      </Link>

      <h1 className="text-3xl font-bold text-white font-heading mb-2">Add New Candidate</h1>
      <p className="text-white/60 mb-8">Manually add a candidate to your CRM.</p>

      <CandidateForm />
    </div>
  );
}