import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import { HexagonBackground } from "@/components/marketing/HexagonBackground";
import { GradientBlur } from "@/components/marketing/GradientBlur";

export default async function ProcessesPage() {
  const supabase = createClient();

  const { data: processes } = await supabase
    .from("processes")
    .select(`
      *,
      candidate_processes(count)
    `)
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
                Processes
              </h1>
              <p className="text-white/60 mt-2">
                {processes?.length || 0} total processes
              </p>
            </div>
            <Link href="/admin/processes/new" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Process
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {processes?.map((process: any) => (
            <Link
              key={process.id}
              href={`/admin/processes/${process.id}`}
              className="card p-6 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{process.role_title}</h3>
                  <p className="text-white/60">{process.company_name}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
                    <span>{process.location || "Remote"}</span>
                    <span>·</span>
                    <span>{process.role_type || "Full-time"}</span>
                    {process.salary_range && (
                      <>
                        <span>·</span>
                        <span>{process.salary_range}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded ${
                    process.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-white/10 text-white/60"
                  }`}>
                    {process.status || "active"}
                  </span>
                  <p className="text-sm text-white/50 mt-2">
                    {process.candidate_processes?.[0]?.count || 0} candidates
                  </p>
                </div>
              </div>
            </Link>
          ))}
          {(!processes || processes.length === 0) && (
            <div className="card p-12 text-center text-white/40">
              No processes yet. Create your first one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}