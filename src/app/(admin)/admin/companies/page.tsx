import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Building2, 
  ChevronRight,
  Filter
} from "lucide-react";
import { ConvertToLeadButton } from "@/components/admin/ConvertToLeadButton";

const BD_STATUSES = [
  { key: "lead", label: "Lead", color: "bg-gray-500" },
  { key: "contacted", label: "Contacted", color: "bg-blue-500" },
  { key: "meeting", label: "Meeting", color: "bg-purple-500" },
  { key: "proposal", label: "Proposal", color: "bg-yellow-500" },
  { key: "client", label: "Client", color: "bg-green-500" },
  { key: "churned", label: "Churned", color: "bg-red-500" },
  { key: "not_interested", label: "Not Interested", color: "bg-gray-700" },
];

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; search?: string; status?: string; leads?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("companies")
    .select(`
      *,
      company_tags (
        tag:tags (id, name, color)
      )
    `)
    .order("updated_at", { ascending: false });

  if (params.filter === "client") {
    query = query.eq("is_client", true);
  }

  if (params.search) {
    query = query.ilike("name", `%${params.search}%`);
  }

  if (params.status) {
    query = query.eq("bd_status", params.status);
  }

  if (params.leads === "true") {
    query = query.eq("is_lead", true);
  }

  const { data: companies, error } = await query;

  // Get candidate counts per company separately
  const { data: candidateCounts } = await supabase
    .from("candidate_companies")
    .select("company_id");

  const countByCompany = candidateCounts?.reduce((acc: Record<string, number>, curr) => {
    acc[curr.company_id] = (acc[curr.company_id] || 0) + 1;
    return acc;
  }, {}) || {};

  // Only show leads in pipeline view
  const leadCompanies = companies?.filter(c => c.is_lead) || [];
  
  // Group leads by BD status for pipeline view
  const pipelineGroups = BD_STATUSES.reduce((acc, status) => {
    acc[status.key] = leadCompanies.filter(c => c.bd_status === status.key) || [];
    return acc;
  }, {} as Record<string, any[]>);

  const totalLeads = leadCompanies.length;
  const totalCompanies = companies?.length || 0;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white font-heading">Companies</h1>
          <p className="text-white/60 mt-1">
            {totalCompanies} companies in CRM · {totalLeads} active leads
          </p>
        </div>
        <Link
          href="/admin/companies/new"
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Company
        </Link>
      </div>

      {/* Search & Filters */}
      <form className="flex flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            name="search"
            placeholder="Search companies..."
            defaultValue={params.search}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-brand-orange/50"
          />
        </div>
        <select 
          name="status"
          defaultValue={params.status || ""}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange/50"
        >
          <option value="">All Statuses</option>
          {BD_STATUSES.map(s => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
        <select 
          name="leads"
          defaultValue={params.leads || ""}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange/50"
        >
          <option value="">All Companies</option>
          <option value="true">Leads Only</option>
        </select>
        <button 
          type="submit"
          className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors inline-flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </form>

      {/* Pipeline View - Only shows leads */}
      {totalLeads > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4">BD Pipeline (Leads Only)</h2>
          <div className="grid grid-cols-5 gap-4">
            {BD_STATUSES.slice(0, 5).map((status) => (
              <div key={status.key} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-3 h-3 rounded-full ${status.color}`} />
                  <span className="text-white font-medium">{status.label}</span>
                  <span className="text-white/40 text-sm ml-auto">
                    {pipelineGroups[status.key]?.length || 0}
                  </span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {pipelineGroups[status.key]?.slice(0, 5).map((company: any) => (
                    <Link
                      key={company.id}
                      href={`/admin/companies/${company.id}`}
                      className="block p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <p className="text-white text-sm font-medium truncate">{company.name}</p>
                      {company.location && (
                        <p className="text-white/40 text-xs truncate">{company.location}</p>
                      )}
                    </Link>
                  ))}
                  {pipelineGroups[status.key]?.length > 5 && (
                    <p className="text-white/40 text-xs text-center py-2">
                      +{pipelineGroups[status.key].length - 5} more
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List View */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">All Companies</h2>
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-white/60 text-sm font-medium px-6 py-4">Company</th>
                <th className="text-left text-white/60 text-sm font-medium px-6 py-4">Lead Status</th>
                <th className="text-left text-white/60 text-sm font-medium px-6 py-4">BD Stage</th>
                <th className="text-left text-white/60 text-sm font-medium px-6 py-4">POC</th>
                <th className="text-left text-white/60 text-sm font-medium px-6 py-4">Employees in CRM</th>
                <th className="text-left text-white/60 text-sm font-medium px-6 py-4">Hiring</th>
                <th className="text-right text-white/60 text-sm font-medium px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {companies?.map((company: any) => {
                const status = BD_STATUSES.find(s => s.key === company.bd_status);
                const candidateCount = countByCompany[company.id] || 0;
                
                return (
                  <tr 
                    key={company.id} 
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-white/60" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{company.name}</p>
                          <p className="text-white/40 text-sm">
                            {company.location || "—"}
                            {company.size && ` · ${company.size}`}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <ConvertToLeadButton 
                        companyId={company.id} 
                        isLead={company.is_lead || false} 
                      />
                    </td>
                    <td className="px-6 py-4">
                      {company.is_lead && status ? (
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${status.color} text-white`}>
                          {status.label}
                        </span>
                      ) : (
                        <span className="text-white/40 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white text-sm">{company.point_of_contact || "—"}</p>
                      <p className="text-white/40 text-xs">{company.poc_email || ""}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-sm ${candidateCount > 0 ? "text-brand-orange font-medium" : "text-white/60"}`}>
                        {candidateCount}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {company.actively_hiring ? (
                        <span className="text-green-400 text-sm">Yes</span>
                      ) : (
                        <span className="text-white/40 text-sm">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/companies/${company.id}`}
                        className="inline-flex items-center gap-1 text-brand-orange hover:underline text-sm"
                      >
                        View
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {(!companies || companies.length === 0) && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-white/40">
                    No companies found. Add your first company to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}