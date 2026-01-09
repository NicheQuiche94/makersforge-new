import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { 
  Users, 
  Building2, 
  Briefcase, 
  Phone,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Plus
} from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Get stats
  const [
    { count: candidateCount },
    { count: companyCount },
    { count: clientCount },
    { count: processCount },
    { data: recentActivity },
    { data: dueTasks },
    { data: pipelineData }
  ] = await Promise.all([
    supabase.from("candidate_profiles").select("*", { count: "exact", head: true }),
    supabase.from("companies").select("*", { count: "exact", head: true }),
    supabase.from("companies").select("*", { count: "exact", head: true }).eq("is_client", true),
    supabase.from("processes").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(10),
    supabase.from("tasks").select("*").eq("completed", false).order("due_date", { ascending: true }).limit(5),
    supabase.from("companies").select("bd_status")
  ]);

  // Calculate pipeline counts
  const pipeline = {
    lead: pipelineData?.filter(c => c.bd_status === "lead").length || 0,
    contacted: pipelineData?.filter(c => c.bd_status === "contacted").length || 0,
    meeting: pipelineData?.filter(c => c.bd_status === "meeting").length || 0,
    proposal: pipelineData?.filter(c => c.bd_status === "proposal").length || 0,
    client: pipelineData?.filter(c => c.bd_status === "client").length || 0,
  };

  const stats = [
    { label: "Candidates", value: candidateCount || 0, icon: Users, href: "/admin/candidates", color: "text-blue-400" },
    { label: "Companies", value: companyCount || 0, icon: Building2, href: "/admin/companies", color: "text-purple-400" },
    { label: "Clients", value: clientCount || 0, icon: CheckCircle, href: "/admin/companies?filter=client", color: "text-green-400" },
    { label: "Active Processes", value: processCount || 0, icon: Briefcase, href: "/admin/processes", color: "text-brand-orange" },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white font-heading">Dashboard</h1>
          <p className="text-white/60 mt-1">Overview of your recruitment CRM</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/candidates/new"
            className="btn-ghost inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Candidate
          </Link>
          <Link
            href="/admin/companies/new"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Company
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white/40 transition-colors" />
            </div>
            <p className="text-3xl font-bold text-white mt-4">{stat.value}</p>
            <p className="text-white/60 text-sm">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* BD Pipeline */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white font-heading">BD Pipeline</h2>
            <Link href="/admin/companies" className="text-brand-orange text-sm hover:underline">
              View all →
            </Link>
          </div>
          
          <div className="flex gap-2 mb-4">
            {Object.entries(pipeline).map(([stage, count]) => (
              <div key={stage} className="flex-1">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-orange rounded-full transition-all"
                    style={{ width: `${Math.min((count / Math.max(...Object.values(pipeline), 1)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            {Object.entries(pipeline).map(([stage, count]) => (
              <div key={stage} className="flex-1 text-center">
                <p className="text-2xl font-bold text-white">{count}</p>
                <p className="text-white/40 text-xs capitalize">{stage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks Due */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white font-heading">Tasks Due</h2>
            <Link href="/admin/settings" className="text-brand-orange text-sm hover:underline">
              View all →
            </Link>
          </div>
          
          {dueTasks && dueTasks.length > 0 ? (
            <div className="space-y-3">
              {dueTasks.map((task: any) => {
                const isOverdue = task.due_date && new Date(task.due_date) < new Date();
                return (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
                  >
                    {isOverdue ? (
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Clock className="w-5 h-5 text-white/40 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{task.title}</p>
                      {task.due_date && (
                        <p className={`text-xs ${isOverdue ? "text-red-400" : "text-white/40"}`}>
                          {new Date(task.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-white/40 text-sm text-center py-8">No tasks due</p>
          )}
          
          <button className="w-full mt-4 py-2 text-sm text-white/60 hover:text-white border border-dashed border-white/20 rounded-lg hover:border-white/40 transition-colors">
            + Add Task
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white font-heading mb-6">Recent Activity</h2>
        
        {recentActivity && recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity: any) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  {activity.entity_type === "candidate" ? (
                    <Users className="w-5 h-5 text-blue-400" />
                  ) : (
                    <Building2 className="w-5 h-5 text-purple-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.description}</p>
                  <p className="text-white/40 text-xs">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/40 text-sm text-center py-8">No recent activity</p>
        )}
      </div>
    </div>
  );
}