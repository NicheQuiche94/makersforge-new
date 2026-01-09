import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Users,
  Briefcase,
  MapPin,
  Filter
} from "lucide-react";

const DISCIPLINES = [
  "Art",
  "Design", 
  "Engineering",
  "Production",
  "Product",
  "Marketing",
  "QA",
  "Audio",
  "Data",
  "Other",
];

const SENIORITY_LEVELS = [
  "Junior",
  "Mid",
  "Senior",
  "Lead",
  "Principal",
  "Director",
  "VP",
  "C-Level",
];

export default async function CandidatesPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    search?: string; 
    discipline?: string; 
    status?: string;
    seniority?: string;
    work_pref?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("candidate_profiles")
    .select(`
      *,
      candidate_tags (
        tag:tags (id, name, color)
      ),
      current_company:companies (id, name)
    `)
    .order("created_at", { ascending: false });

  if (params.search) {
    query = query.or(`first_name.ilike.%${params.search}%,last_name.ilike.%${params.search}%,email.ilike.%${params.search}%,current_title.ilike.%${params.search}%,speciality.ilike.%${params.search}%`);
  }

  if (params.discipline) {
    query = query.eq("discipline", params.discipline);
  }

  if (params.status) {
    query = query.eq("looking_status", params.status);
  }

  if (params.seniority) {
    query = query.eq("seniority_level", params.seniority);
  }

  if (params.work_pref) {
    query = query.eq("work_preference", params.work_pref);
  }

  const { data: candidates, error } = await query;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white font-heading">Candidates</h1>
          <p className="text-white/60 mt-1">{candidates?.length || 0} candidates in your CRM</p>
        </div>
        <Link
          href="/admin/candidates/new"
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Candidate
        </Link>
      </div>

      {/* Search & Filters */}
      <form className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              name="search"
              placeholder="Search by name, email, title, or speciality..."
              defaultValue={params.search}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-brand-orange/50"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4">
          <select 
            name="discipline"
            defaultValue={params.discipline || ""}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-brand-orange/50"
          >
            <option value="">All Disciplines</option>
            {DISCIPLINES.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          
          <select 
            name="seniority"
            defaultValue={params.seniority || ""}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-brand-orange/50"
          >
            <option value="">All Seniorities</option>
            {SENIORITY_LEVELS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          
          <select 
            name="status"
            defaultValue={params.status || ""}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-brand-orange/50"
          >
            <option value="">All Statuses</option>
            <option value="actively_looking">Actively Looking</option>
            <option value="open_to_opportunities">Open to Opportunities</option>
            <option value="not_looking">Not Looking</option>
          </select>
          
          <select 
            name="work_pref"
            defaultValue={params.work_pref || ""}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-brand-orange/50"
          >
            <option value="">All Work Preferences</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-site</option>
            <option value="flexible">Flexible</option>
          </select>
          
          <button 
            type="submit"
            className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange/90 transition-colors inline-flex items-center gap-2 text-sm"
          >
            <Filter className="w-4 h-4" />
            Apply Filters
          </button>
          
          {(params.search || params.discipline || params.status || params.seniority || params.work_pref) && (
            <Link
              href="/admin/candidates"
              className="px-4 py-2 bg-white/10 text-white/60 rounded-lg hover:bg-white/20 hover:text-white transition-colors text-sm"
            >
              Clear Filters
            </Link>
          )}
        </div>
      </form>

      {/* Candidates Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {candidates?.map((candidate: any) => {
          const tags = candidate.candidate_tags?.map((ct: any) => ct.tag).filter(Boolean) || [];
          const statusColors: Record<string, string> = {
            actively_looking: "bg-green-500",
            open_to_opportunities: "bg-yellow-500",
            not_looking: "bg-gray-500",
          };
          
          return (
            <Link
              key={candidate.id}
              href={`/admin/candidates/${candidate.id}`}
              className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-white/20 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-orange/20 flex items-center justify-center">
                    <span className="text-brand-orange font-bold">
                      {candidate.first_name?.[0]}{candidate.last_name?.[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium group-hover:text-brand-orange transition-colors">
                      {candidate.first_name} {candidate.last_name}
                    </h3>
                    <p className="text-white/60 text-sm">{candidate.current_title || "No title"}</p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${statusColors[candidate.looking_status] || "bg-gray-500"}`} 
                     title={candidate.looking_status?.replace(/_/g, " ")} />
              </div>

              <div className="space-y-2 mb-4">
                {candidate.current_company && (
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <Briefcase className="w-4 h-4" />
                    {candidate.current_company.name}
                  </div>
                )}
                {candidate.discipline && (
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <Users className="w-4 h-4" />
                    {candidate.discipline}
                    {candidate.seniority_level && ` · ${candidate.seniority_level}`}
                    {candidate.speciality && ` · ${candidate.speciality}`}
                  </div>
                )}
                {candidate.preferred_locations && (
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <MapPin className="w-4 h-4" />
                    {candidate.preferred_locations}
                  </div>
                )}
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tags.slice(0, 3).map((tag: any) => (
                    <span
                      key={tag.id}
                      className="px-2 py-0.5 rounded-full text-xs"
                      style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                    >
                      {tag.name}
                    </span>
                  ))}
                  {tags.length > 3 && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white/60">
                      +{tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {(!candidates || candidates.length === 0) && (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No candidates found</p>
          <Link href="/admin/candidates/new" className="text-brand-orange hover:underline text-sm mt-2 inline-block">
            Add your first candidate
          </Link>
        </div>
      )}
    </div>
  );
}