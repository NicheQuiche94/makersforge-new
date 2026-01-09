import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Building2, 
  Globe, 
  Linkedin, 
  Users,
  Plus,
  MapPin,
  UserCheck,
  AlertTriangle
} from "lucide-react";
import { CompanyStatusSelector } from "@/components/admin/CompanyStatusSelector";
import { CompanyNotes } from "@/components/admin/CompanyNotes";
import { CompanyTags } from "@/components/admin/CompanyTags";
import { AddNoteForm } from "@/components/admin/AddNoteForm";
import { ActivityTimeline } from "@/components/admin/ActivityTimeline";
import { ConvertToLeadButton } from "@/components/admin/ConvertToLeadButton";
import { ToggleField } from "@/components/admin/ToggleField";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Get company with tags
  const { data: company, error } = await supabase
    .from("companies")
    .select(`
      *,
      company_tags (
        tag:tags (id, name, color)
      )
    `)
    .eq("id", id)
    .single();

  if (error || !company) {
    notFound();
  }

  // Get candidates at this company
  const { data: candidatesAtCompany } = await supabase
    .from("candidate_companies")
    .select(`
      *,
      candidate:candidate_profiles (
        id,
        first_name,
        last_name,
        email,
        current_title,
        discipline,
        speciality
      )
    `)
    .eq("company_id", id)
    .order("is_current", { ascending: false });

  // Get company notes
  const { data: companyNotes } = await supabase
    .from("company_notes")
    .select("*")
    .eq("company_id", id)
    .order("created_at", { ascending: false });

  // Get activity log
  const { data: activityLog } = await supabase
    .from("activity_log")
    .select("*")
    .eq("entity_type", "company")
    .eq("entity_id", id)
    .order("created_at", { ascending: false })
    .limit(20);

  // Get processes with this company
  const { data: processes } = await supabase
    .from("processes")
    .select("*")
    .eq("company_name", company.name)
    .eq("status", "active");

  // Get all available tags
  const { data: availableTags } = await supabase
    .from("tags")
    .select("*")
    .eq("entity_type", "company");

  const currentCandidates = candidatesAtCompany?.filter(c => c.is_current) || [];
  const pastCandidates = candidatesAtCompany?.filter(c => !c.is_current) || [];

  // Check for recent departures (left in last 90 days)
  const recentDepartures = pastCandidates.filter(c => {
    if (!c.end_date) return false;
    const endDate = new Date(c.end_date);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    return endDate > ninetyDaysAgo;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/companies"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Companies
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white/60" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white font-heading">{company.name}</h1>
                <ConvertToLeadButton companyId={id} isLead={company.is_lead || false} />
              </div>
              <div className="flex items-center gap-4 mt-2 text-white/60 text-sm">
                {company.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {company.location}
                  </span>
                )}
                {company.size && (
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {company.size} employees
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-3">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-white/60 hover:text-white text-sm"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
                {company.linkedin_url && (
                  <a
                    href={company.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-white/60 hover:text-white text-sm"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
          <Link
            href={`/admin/companies/${id}/edit`}
            className="btn-ghost"
          >
            Edit Company
          </Link>
        </div>

        {/* Tags */}
        <div className="mt-4">
          <CompanyTags 
            companyId={id} 
            currentTags={company.company_tags?.map((ct: any) => ct.tag) || []}
            availableTags={availableTags || []}
          />
        </div>
      </div>

      {/* BD Status - only show if it's a lead */}
      {company.is_lead && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">BD Pipeline Status</h2>
          <CompanyStatusSelector 
            companyId={id} 
            currentStatus={company.bd_status || "lead"}
            isClient={company.is_client || false}
          />
        </div>
      )}

      {/* Alert for recent departures */}
      {recentDepartures.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-8 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-500 font-medium">Potential Backfill Opportunity</p>
            <p className="text-yellow-500/80 text-sm mt-1">
              {recentDepartures.length} candidate{recentDepartures.length > 1 ? "s" : ""} left this company recently.
            </p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Company Info */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Company Information</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-white/50 text-sm mb-1">Headcount</p>
                <p className="text-white">{company.size || "—"}</p>
              </div>
              <div>
                <p className="text-white/50 text-sm mb-1">Industry</p>
                <p className="text-white">{company.industry || "Mobile Gaming"}</p>
              </div>
              <div>
                <p className="text-white/50 text-sm mb-1">Game Categories</p>
                <p className="text-white">{company.game_categories || "—"}</p>
              </div>
              <div>
                <p className="text-white/50 text-sm mb-1">Remote Policy</p>
                <p className="text-white capitalize">{company.remote_policy?.replace(/_/g, " ") || "—"}</p>
              </div>
              <div>
                <p className="text-white/50 text-sm mb-1">Actively Hiring</p>
                <ToggleField 
                  companyId={id}
                  field="actively_hiring"
                  value={company.actively_hiring || false}
                />
              </div>
              <div>
                <p className="text-white/50 text-sm mb-1">Client Status</p>
                <ToggleField 
                  companyId={id}
                  field="is_client"
                  value={company.is_client || false}
                  label={company.is_client ? "Active Client" : "Not a Client"}
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Point of Contact</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-white/50 text-sm mb-1">Name</p>
                <p className="text-white">{company.point_of_contact || "—"}</p>
              </div>
              <div>
                <p className="text-white/50 text-sm mb-1">Email</p>
                {company.poc_email ? (
                  <a href={`mailto:${company.poc_email}`} className="text-brand-orange hover:underline">
                    {company.poc_email}
                  </a>
                ) : (
                  <p className="text-white">—</p>
                )}
              </div>
              <div>
                <p className="text-white/50 text-sm mb-1">Phone</p>
                <p className="text-white">{company.poc_phone || "—"}</p>
              </div>
              <div>
                <p className="text-white/50 text-sm mb-1">Last Contacted</p>
                <p className="text-white">
                  {company.last_contacted_at 
                    ? new Date(company.last_contacted_at).toLocaleDateString()
                    : "Never"
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Notes</h2>
            <AddNoteForm entityType="company" entityId={id} />
            <CompanyNotes notes={companyNotes || []} />
          </div>

          {/* Employees in CRM */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Employees in CRM</h2>
              <span className="text-white/40 text-sm">{candidatesAtCompany?.length || 0} total</span>
            </div>

            {currentCandidates.length > 0 && (
              <div className="mb-6">
                <p className="text-white/60 text-sm mb-3 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-green-500" />
                  Currently Working Here ({currentCandidates.length})
                </p>
                <div className="space-y-2">
                  {currentCandidates.map((cc: any) => (
                    <Link
                      key={cc.id}
                      href={`/admin/candidates/${cc.candidate.id}`}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <span className="text-green-500 text-sm font-medium">
                            {cc.candidate.first_name?.[0]}{cc.candidate.last_name?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {cc.candidate.first_name} {cc.candidate.last_name}
                          </p>
                          <p className="text-white/60 text-sm">{cc.job_title || cc.candidate.current_title}</p>
                        </div>
                      </div>
                      <span className="text-green-500 text-xs px-2 py-1 bg-green-500/10 rounded-full">
                        Current
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {pastCandidates.length > 0 && (
              <div>
                <p className="text-white/60 text-sm mb-3">Previously Worked Here ({pastCandidates.length})</p>
                <div className="space-y-2">
                  {pastCandidates.map((cc: any) => (
                    <Link
                      key={cc.id}
                      href={`/admin/candidates/${cc.candidate.id}`}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <span className="text-white/60 text-sm font-medium">
                            {cc.candidate.first_name?.[0]}{cc.candidate.last_name?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {cc.candidate.first_name} {cc.candidate.last_name}
                          </p>
                          <p className="text-white/60 text-sm">{cc.job_title}</p>
                        </div>
                      </div>
                      {cc.end_date && (
                        <span className="text-white/40 text-xs">
                          Left {new Date(cc.end_date).toLocaleDateString()}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {(!candidatesAtCompany || candidatesAtCompany.length === 0) && (
              <p className="text-white/40 text-sm text-center py-8">
                No candidates from this company in your CRM yet
              </p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Active Processes */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Active Processes</h2>
            </div>
            
            {processes && processes.length > 0 ? (
              <div className="space-y-3">
                {processes.map((process: any) => (
                  <Link
                    key={process.id}
                    href={`/admin/processes/${process.id}`}
                    className="block p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <p className="text-white font-medium">{process.role_title}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-white/40 text-sm text-center py-4">
                No active processes
              </p>
            )}
            
            <Link
              href={`/admin/processes/new?company=${encodeURIComponent(company.name)}`}
              className="flex items-center justify-center gap-2 w-full mt-4 py-3 text-sm text-white/60 hover:text-white border border-dashed border-white/20 rounded-lg hover:border-white/40 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Process
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Quick Info</h2>
            <div className="space-y-4">
              <div>
                <p className="text-white/50 text-sm">Added to CRM</p>
                <p className="text-white">
                  {new Date(company.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-white/50 text-sm">Last Updated</p>
                <p className="text-white">
                  {new Date(company.updated_at || company.created_at).toLocaleDateString()}
                </p>
              </div>
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