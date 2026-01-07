"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { HexagonBackground } from "@/components/marketing/HexagonBackground";
import { GradientBlur } from "@/components/marketing/GradientBlur";

const INTERVIEW_STAGES = [
  "Screening",
  "Interview 1",
  "Interview 2", 
  "Interview 3",
  "Technical Test",
  "Final Interview",
  "Offer",
];

export default function NewProcessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    role_title: "",
    role_type: "Full-time",
    location: "",
    salary_range: "",
    status: "active",
    notes: "",
    interview_stages: ["Screening", "Interview 1", "Offer"],
  });

  function updateField(field: string, value: any) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function toggleStage(stage: string) {
    setFormData((prev) => {
      const stages = prev.interview_stages;
      if (stages.includes(stage)) {
        return { ...prev, interview_stages: stages.filter((s) => s !== stage) };
      }
      return { ...prev, interview_stages: [...stages, stage] };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from("processes")
      .insert([formData])
      .select()
      .single();

    if (error) {
      console.error("Error creating process:", error);
      setLoading(false);
      return;
    }

    router.push(`/admin/processes/${data.id}`);
  }

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="relative py-12">
        <HexagonBackground />
        <GradientBlur position="top-right" size="lg" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-3xl px-6 lg:px-8">
          <Link
            href="/admin/processes"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to processes
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-heading">
            New Process
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <div className="card p-8 space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => updateField("company_name", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-orange/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Role Title *
                </label>
                <input
                  type="text"
                  value={formData.role_title}
                  onChange={(e) => updateField("role_title", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-orange/50"
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Role Type
                </label>
                <select
                  value={formData.role_type}
                  onChange={(e) => updateField("role_type", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-orange/50"
                >
                  <option value="Full-time" className="bg-brand-black">Full-time</option>
                  <option value="Contract" className="bg-brand-black">Contract</option>
                  <option value="Freelance" className="bg-brand-black">Freelance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-orange/50"
                  placeholder="e.g. Remote, London, etc."
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Salary Range
                </label>
                <input
                  type="text"
                  value={formData.salary_range}
                  onChange={(e) => updateField("salary_range", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-orange/50"
                  placeholder="e.g. £60,000 - £80,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-orange/50"
                >
                  <option value="active" className="bg-brand-black">Active</option>
                  <option value="paused" className="bg-brand-black">Paused</option>
                  <option value="closed" className="bg-brand-black">Closed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-4">
                Interview Stages
              </label>
              <div className="flex flex-wrap gap-3">
                {INTERVIEW_STAGES.map((stage) => (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => toggleStage(stage)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      formData.interview_stages.includes(stage)
                        ? "bg-brand-orange border-brand-orange text-white"
                        : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-orange/50"
                placeholder="Any additional notes about this process..."
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Link href="/admin/processes" className="btn-ghost">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || !formData.company_name || !formData.role_title}
                className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Process"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}