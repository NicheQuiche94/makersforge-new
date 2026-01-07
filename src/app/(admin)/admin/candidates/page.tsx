import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Search, Filter, Plus } from "lucide-react";
import { HexagonBackground } from "@/components/marketing/HexagonBackground";
import { GradientBlur } from "@/components/marketing/GradientBlur";

export default async function CandidatesPage() {
  const supabase = createClient();

  const { data: candidates } = await supabase
    .from("candidate_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="relative py-12">
        <HexagonBackground />
        <GradientBlur position="top-right" size="lg" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white font-heading">
                Candidates
              </h1>
              <p className="text-white/60 mt-2">
                {candidates?.length || 0} total candidates
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
        {/* Candidates Table */}
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6 text-sm font-medium text-white/60">Name</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-white/60">Discipline</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-white/60">Level</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-white/60">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-white/60">Joined</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-white/60"></th>
              </tr>
            </thead>
            <tbody>
              {candidates?.map((candidate) => (
                <tr key={candidate.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-white font-medium">
                        {candidate.first_name} {candidate.last_name}
                      </p>
                      <p className="text-sm text-white/50">{candidate.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-white/80">{candidate.discipline || "—"}</td>
                  <td className="py-4 px-6 text-white/80">{candidate.experience_level || "—"}</td>
                  <td className="py-4 px-6">
                    <span className={`text-xs px-2 py-1 rounded ${
                      candidate.looking_status === "yes"
                        ? "bg-green-500/20 text-green-400"
                        : candidate.looking_status === "passive"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-white/10 text-white/60"
                    }`}>
                      {candidate.looking_status === "yes"
                        ? "Active"
                        : candidate.looking_status === "passive"
                        ? "Passive"
                        : "Not looking"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-white/50 text-sm">
                    {new Date(candidate.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      href={`/admin/candidates/${candidate.id}`}
                      className="text-sm text-brand-orange hover:text-brand-orange/80"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!candidates || candidates.length === 0) && (
            <div className="py-12 text-center text-white/40">
              No candidates found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}