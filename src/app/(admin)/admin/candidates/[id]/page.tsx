import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Mail, 
  Phone,
  Linkedin,
  Globe,
  Plus,
  ExternalLink
} from "lucide-react";
import { CandidateTags } from "@/components/admin/CandidateTags";
import { CandidateNotes } from "@/components/admin/CandidateNotes";
import { ActivityTimeline } from "@/components/admin/ActivityTimeline";
import { WorkHistory } from "@/components/admin/WorkHistory";

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Get candidate with tags and current company
  const { data: candidate, error } = await supabase
    .from("candidate_profiles")
    .select(`
      *,
      candidate_tags (
        tag:tags (id, name, color)
      ),
      current_company:companies (id, name, website)
    `)
    .eq("id", id)
    .single();

  if (error || !candidate) {
    notFound();
  }

  // Get work history
  const { data: workHistory } = await supabase
    .from("candidate_companies")
    .select(`
      *,
      company:companies (id, name, website, location)
    `)
    .eq("candidate_id", id)
    .order("is_current", { ascending: false })
    .order("end_date", { ascending: false, nullsFirst: true });

  // Get activity log
  const { data: activityLog } = await supabase
    .from("activity_log")
    .select("*")
    .eq("entity_type", "candidate")
    .eq("entity_id", id)
    .order("created_at", { ascending: false })
    .limit(20);

  // Get processes this candidate is in
  const { data: candidateProcesses } = await supabase
    .from("candidate_processes")
    .select(`
      *,
      process:processes (id, role_title, company_name, status)
    `)
    .eq("candidate_id", id);

  // Get available tags
  const { data: availableTags } = await supabase
    .from("tags")
    .select("*")
    .eq("entity_type", "candidate");

  // Status labels mapping - supports both new onboarding values and legacy values
  const statusLabels: Record<string, { label: string; color: string }> = {
    // New values from onboarding (yes/passive/no)
    yes: { label: "Actively Looking", color: "bg-green-500" },
    passive: { label: "Open to Opportunities", color: "bg-yellow-500" },
    no: { label: "Not Looking", color: "bg-gray-500" },
    // Legacy values (in case old data exists)
    actively_looking: { label: "Actively Looking", color: "bg-green-500" },
    open_to_opportunities: { label: "Open to Opportunities", color: "bg-yellow-500" },
    not_looking: { label: "Not Looking", color: "bg-gray-500" },
  };

  const currentStatus = candidate.looking_status 
    ? statusLabels[candidate.looking_status] || { label: candidate.looking_status, color: "bg-gray-500" }
    : { label: "Unknown", color: "bg-gray-500" };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/candidates"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Candidates
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-brand-orange/20 flex items-center justify-center">
              <span className="text-brand-orange text-2xl font-bold">
                {candidate.first_name?.[0]}{candidate.last_name?.[0]}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white font-heading">
                  {candidate.first_name} {candidate.last_name}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs text-white ${currentStatus.color}`}>
                  {currentStatus.label}
                </span>
              </div>
              <p className="text-white/60 mt-1">
                {candidate.current_title || "No title"}
                {candidate.current_company && (
                  <>
                    {" "}at{" "}
                    <Link 
                      href={`/admin/companies/${candidate.current_company.id}`} 
                      className="text-brand-orange hover:underline"
                    >
                      {candidate.current_company.name}
                    </Link>
                  </>
                )}
              </p>
              <div className="flex items-center gap-4 mt-3">
                {candidate.email && (
                  <a 
                    href={`mailto:${candidate.email}`} 
                    className="inline-flex items-center gap-1 text-white/60 hover:text-white text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    {candidate.email}
                  </a>
                )}
                {candidate.phone && (
                  <a 
                    href={`tel:${candidate.phone}`} 
                    className="inline-flex items-center gap-1 text-white/60 hover:text-white text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    {candidate.phone}
                  </a>
                )}
                {candidate.linkedin_url && (
                  <a 
                    href={candidate.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 text-white/60 hover:text-white text-sm"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                {candidate.portfolio_url && (
                  <a 
                    href={candidate.portfolio_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 text-white/60 hover:text-white text-sm"
                  >
                    <Globe className="w-4 h-4" />
                    Portfolio
                  </a>
                )}
              </div>
            </div>
          </div>
          <Link
            href={`/admin/candidates/${id}/edit`}
            className="btn-ghost"
          >
            Edit Candidate
          </Link>
        </div>

        {/* Tags */}
        <div className="mt-4">
          <CandidateTags 
            candidateId={id} 
            currentTags={candidate.candidate_tags?.map((ct: any) => ct.tag) || []}
            availableTags={availableTags || []}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Info */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Profile Information</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-white/50 text-sm mb-1">Discipline</p>
                <p className="text-white">{candidate.discipline || "—"}</p>
              </div>
              <div>
                <p className="text-white/50 text-sm mb-1">Speciality</p>
                <p className="text-white">{candidate.speciality || "—"}</p>
              </div>
              <div>
                <p className="text-white/50 text-sm mb-1">Experience</p>
                <p className="text-white">{candidate.years_experience ? `${candidate.years_experience} years` : "—"}</p>
              </div>
              <div>
                <p className="text-white/50 text-sm mb-1">Seniority</p>
                <p className="text-white">{candidate.experience_level || candidate.seniority_level || "—"}</p>
              </div>
              <div>
                <p className="text-white/50 text-sm mb-1">Preferred Locations</p>
                <p className="text-white">{candidate.preferred_locations || "—"}</p>
              </div>
              <div>
                <p className="text-white/50 text-sm mb-1">Work Preference</p>
                <p className="text-white">
                  {candidate.workplace_preferences?.length 
                    ? candidate.workplace_preferences.join(", ")
                    : candidate.work_preference?.replace(/_/g, " ") || "—"}
                </p>
              </div>
              <div>
                <p className="text-white/50 text-sm mb-1">Salary Expectation</p>
                <p className="text-white">
                  {candidate.salary_minimum && candidate.salary_ideal 
                    ? `${candidate.salary_minimum} - ${candidate.salary_ideal}`
                    : candidate.salary_expectation || "—"}
                </p>
              </div>
              <div>
                <p className="text-white/50 text-sm mb-1">Notice Period</p>
                <p className="text-white">{candidate.available_from || candidate.notice_period || "—"}</p>
              </div>
            </div>

            {/* Game Experience */}
            {(candidate.game_categories?.length > 0 || candidate.genres?.length > 0) && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-md font-semibold text-white mb-4">Game Experience</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {candidate.game_categories?.length > 0 && (
                    <div>
                      <p className="text-white/50 text-sm mb-2">Categories</p>
                      <div className="flex flex-wrap gap-2">
                        {candidate.game_categories.map((cat: string) => (
                          <span 
                            key={cat}
                            className="px-2 py-1 bg-white/10 rounded text-white/80 text-xs"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {candidate.genres?.length > 0 && (
                    <div>
                      <p className="text-white/50 text-sm mb-2">Genres</p>
                      <div className="flex flex-wrap gap-2">
                        {candidate.genres.map((genre: string) => (
                          <span 
                            key={genre}
                            className="px-2 py-1 bg-white/10 rounded text-white/80 text-xs"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Work History */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Work History</h2>
              <Link
                href={`/admin/candidates/${id}/work-history/new`}
                className="text-brand-orange text-sm hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </Link>
            </div>
            <WorkHistory history={workHistory || []} />
          </div>

          {/* Notes Section */}
          <CandidateNotes 
            candidateId={id}
            rawNotes={candidate.raw_notes || ""}
            recruiterSummary={candidate.recruiter_summary || ""}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Active Processes */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Processes</h2>
            </div>
            
            {candidateProcesses && candidateProcesses.length > 0 ? (
              <div className="space-y-3">
                {candidateProcesses.map((cp: any) => (
                  <Link
                    key={cp.id}
                    href={`/admin/processes/${cp.process.id}`}
                    className="block p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <p className="text-white font-medium">{cp.process.role_title}</p>
                    <p className="text-white/60 text-sm">{cp.process.company_name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        cp.process.status === "active" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-gray-500/20 text-gray-400"
                      }`}>
                        {cp.process.status}
                      </span>
                      <span className="text-white/40 text-xs capitalize">
                        {cp.status?.replace(/_/g, " ") || cp.stage?.replace(/_/g, " ")}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-white/40 text-sm text-center py-4">
                Not in any processes
              </p>
            )}
            
            <Link
              href={`/admin/processes/new?candidate=${id}`}
              className="flex items-center justify-center gap-2 w-full mt-4 py-3 text-sm text-white/60 hover:text-white border border-dashed border-white/20 rounded-lg hover:border-white/40 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add to Process
            </Link>
          </div>

          {/* Quick Info */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Quick Info</h2>
            <div className="space-y-4">
              <div>
                <p className="text-white/50 text-sm">Added</p>
                <p className="text-white">
                  {new Date(candidate.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-white/50 text-sm">Last Updated</p>
                <p className="text-white">
                  {new Date(candidate.updated_at || candidate.created_at).toLocaleDateString()}
                </p>
              </div>
              {candidate.cv_url && (
                <div>
                  <p className="text-white/50 text-sm mb-2">CV</p>
                  <a
                    href={candidate.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-brand-orange hover:underline text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View CV
                  </a>
                </div>
              )}
              {candidate.job_types?.length > 0 && (
                <div>
                  <p className="text-white/50 text-sm mb-1">Job Types</p>
                  <p className="text-white">{candidate.job_types.join(", ")}</p>
                </div>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Activity</h2>
            <ActivityTimeline activities={activityLog || []} />
          </div>
        </div>
      </div>
    </div>
  );
}