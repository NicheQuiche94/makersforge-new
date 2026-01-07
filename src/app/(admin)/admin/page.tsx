import { createClient } from "@/lib/supabase/server";
import { Users, Briefcase, UserCheck, Clock } from "lucide-react";
import Link from "next/link";
import { HexagonBackground } from "@/components/marketing/HexagonBackground";
import { GradientBlur } from "@/components/marketing/GradientBlur";

export default async function AdminDashboard() {
  const supabase = createClient();

  const [
    { count: totalCandidates },
    { count: activeCandidates },
    { count: totalProcesses },
    { count: activeProcesses },
  ] = await Promise.all([
    supabase.from("candidate_profiles").select("*", { count: "exact", head: true }),
    supabase.from("candidate_profiles").select("*", { count: "exact", head: true }).eq("looking_status", "yes"),
    supabase.from("processes").select("*", { count: "exact", head: true }),
    supabase.from("processes").select("*", { count: "exact", head: true }).eq("status", "active"),
  ]);

  const { data: recentCandidates } = await supabase
    .from("candidate_profiles")
    .select("id, first_name, last_name, discipline, experience_level, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentProcesses } = await supabase
    .from("candidate_processes")
    .select(`
      id,
      status,
      current_interview_stage,
      updated_at,
      candidate:candidate_profiles(first_name, last_name),
      process:processes(role_title, company_name)
    `)
    .order("updated_at", { ascending: false })
    .limit(5);

  const stats = [
    { label: "Total Candidates", value: totalCandidates || 0, icon: Users, href: "/admin/candidates" },
    { label: "Actively Looking", value: activeCandidates || 0, icon: UserCheck, href: "/admin/candidates?status=active" },
    { label: "Total Processes", value: totalProcesses || 0, icon: Briefcase, href: "/admin/processes" },
    { label: "Active Processes", value: activeProcesses || 0, icon: Clock, href: "/admin/processes?status=active" },
  ];

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="relative py-12">
        <HexagonBackground />
        <GradientBlur position="top-right" size="lg" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white font-heading">
            Admin Dashboard
          </h1>
          <p className="text-white/60 mt-2">
            Manage candidates and recruitment processes
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="card p-6 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-orange/10 rounded-lg">
                    <Icon className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-white/60">{stat.label}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Candidates */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white font-heading">Recent Candidates</h2>
              <Link href="/admin/candidates" className="text-sm text-brand-orange hover:text-brand-orange/80">
                View all →
              </Link>
            </div>
            <div className="space-y-4">
              {recentCandidates?.map((candidate) => (
                <Link
                  key={candidate.id}
                  href={`/admin/candidates/${candidate.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div>
                    <p className="text-white font-medium">
                      {candidate.first_name} {candidate.last_name}
                    </p>
                    <p className="text-sm text-white/60">
                      {candidate.discipline} · {candidate.experience_level}
                    </p>
                  </div>
                  <span className="text-xs text-white/40">
                    {new Date(candidate.created_at).toLocaleDateString()}
                  </span>
                </Link>
              ))}
              {(!recentCandidates || recentCandidates.length === 0) && (
                <p className="text-white/40 text-center py-4">No candidates yet</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white font-heading">Recent Activity</h2>
              <Link href="/admin/processes" className="text-sm text-brand-orange hover:text-brand-orange/80">
                View all →
              </Link>
            </div>
            <div className="space-y-4">
              {recentProcesses?.map((cp: any) => (
                <div
                  key={cp.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                >
                  <div>
                    <p className="text-white font-medium">
                      {cp.candidate?.first_name} {cp.candidate?.last_name}
                    </p>
                    <p className="text-sm text-white/60">
                      {cp.process?.role_title} at {cp.process?.company_name}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-brand-orange/20 text-brand-orange rounded">
                    {cp.current_interview_stage || cp.status}
                  </span>
                </div>
              ))}
              {(!recentProcesses || recentProcesses.length === 0) && (
                <p className="text-white/40 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}