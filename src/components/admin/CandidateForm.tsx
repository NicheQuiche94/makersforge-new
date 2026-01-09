"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Loader2, Search, Plus, X } from "lucide-react";

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

const LOOKING_STATUSES = [
  { key: "actively_looking", label: "Actively Looking" },
  { key: "open_to_opportunities", label: "Open to Opportunities" },
  { key: "not_looking", label: "Not Looking" },
];

interface CandidateFormProps {
  candidate?: any;
}

export function CandidateForm({ candidate }: CandidateFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Company search
  const [companySearch, setCompanySearch] = useState("");
  const [companyResults, setCompanyResults] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any>(candidate?.current_company || null);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [creatingCompany, setCreatingCompany] = useState(false);

  const [formData, setFormData] = useState({
    first_name: candidate?.first_name || "",
    last_name: candidate?.last_name || "",
    email: candidate?.email || "",
    phone: candidate?.phone || "",
    linkedin_url: candidate?.linkedin_url || "",
    portfolio_url: candidate?.portfolio_url || "",
    current_title: candidate?.current_title || "",
    discipline: candidate?.discipline || "",
    speciality: candidate?.speciality || "",
    years_experience: candidate?.years_experience || "",
    seniority_level: candidate?.seniority_level || "",
    looking_status: candidate?.looking_status || "open_to_opportunities",
    preferred_locations: candidate?.preferred_locations || "",
    work_preference: candidate?.work_preference || "",
    salary_expectation: candidate?.salary_expectation || "",
    notice_period: candidate?.notice_period || "",
    raw_notes: candidate?.raw_notes || "",
  });

  // Search companies
  useEffect(() => {
    async function searchCompanies() {
      if (companySearch.length < 2) {
        setCompanyResults([]);
        return;
      }

      const { data } = await supabase
        .from("companies")
        .select("id, name, location")
        .ilike("name", `%${companySearch}%`)
        .limit(5);

      setCompanyResults(data || []);
    }

    const timeout = setTimeout(searchCompanies, 300);
    return () => clearTimeout(timeout);
  }, [companySearch]);

  async function createQuickCompany() {
    if (!companySearch.trim()) return;
    setCreatingCompany(true);

    const { data, error } = await supabase
      .from("companies")
      .insert({ name: companySearch.trim() })
      .select()
      .single();

    if (data) {
      setSelectedCompany(data);
      setCompanySearch("");
      setShowCompanyDropdown(false);
    }
    setCreatingCompany(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...formData,
        years_experience: formData.years_experience ? parseInt(formData.years_experience) : null,
        current_company_id: selectedCompany?.id || null,
        updated_at: new Date().toISOString(),
      };

      if (candidate?.id) {
        // Update existing
        const { error } = await supabase
          .from("candidate_profiles")
          .update(payload)
          .eq("id", candidate.id);

        if (error) throw error;

        // Log activity
        await supabase.from("activity_log").insert({
          entity_type: "candidate",
          entity_id: candidate.id,
          activity_type: "updated",
          description: `Updated candidate: ${formData.first_name} ${formData.last_name}`,
        });

        router.push(`/admin/candidates/${candidate.id}`);
      } else {
        // Create new
        const { data, error } = await supabase
          .from("candidate_profiles")
          .insert(payload)
          .select()
          .single();

        if (error) throw error;

        // Create work history entry if company selected
        if (selectedCompany?.id && data) {
          await supabase.from("candidate_companies").insert({
            candidate_id: data.id,
            company_id: selectedCompany.id,
            is_current: true,
            job_title: formData.current_title,
          });
        }

        // Log activity
        await supabase.from("activity_log").insert({
          entity_type: "candidate",
          entity_id: data.id,
          activity_type: "created",
          description: `Created candidate: ${formData.first_name} ${formData.last_name}`,
        });

        router.push(`/admin/candidates/${data.id}`);
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Basic Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/60 text-sm mb-2">First Name *</label>
            <input
              type="text"
              required
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Last Name *</label>
            <input
              type="text"
              required
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">LinkedIn URL</label>
            <input
              type="url"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Portfolio URL</label>
            <input
              type="url"
              value={formData.portfolio_url}
              onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
            />
          </div>
        </div>
      </div>

      {/* Professional Info */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Professional Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/60 text-sm mb-2">Current Title</label>
            <input
              type="text"
              value={formData.current_title}
              onChange={(e) => setFormData({ ...formData, current_title: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
              placeholder="e.g. Senior Game Designer"
            />
          </div>
          
          {/* Company Search */}
          <div className="relative">
            <label className="block text-white/60 text-sm mb-2">Current Company</label>
            {selectedCompany ? (
              <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
                <span className="text-white flex-1">{selectedCompany.name}</span>
                <button
                  type="button"
                  onClick={() => setSelectedCompany(null)}
                  className="text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={companySearch}
                    onChange={(e) => {
                      setCompanySearch(e.target.value);
                      setShowCompanyDropdown(true);
                    }}
                    onFocus={() => setShowCompanyDropdown(true)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
                    placeholder="Search or create company..."
                  />
                </div>
                {showCompanyDropdown && (companyResults.length > 0 || companySearch.length >= 2) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-brand-black-light border border-white/10 rounded-xl shadow-xl z-10 overflow-hidden">
                    {companyResults.map((company) => (
                      <button
                        key={company.id}
                        type="button"
                        onClick={() => {
                          setSelectedCompany(company);
                          setCompanySearch("");
                          setShowCompanyDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <p className="font-medium">{company.name}</p>
                        {company.location && (
                          <p className="text-sm text-white/40">{company.location}</p>
                        )}
                      </button>
                    ))}
                    {companySearch.length >= 2 && (
                      <button
                        type="button"
                        onClick={createQuickCompany}
                        disabled={creatingCompany}
                        className="w-full px-4 py-3 text-left text-brand-orange hover:bg-white/10 transition-colors flex items-center gap-2 border-t border-white/10"
                      >
                        {creatingCompany ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                        Create "{companySearch}"
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-2">Discipline</label>
            <select
              value={formData.discipline}
              onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange/50"
            >
              <option value="">Select discipline</option>
              {DISCIPLINES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Speciality</label>
            <input
              type="text"
              value={formData.speciality}
              onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
              placeholder="e.g. Economy Design, Monetisation"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Years Experience</label>
            <input
              type="number"
              min="0"
              max="50"
              value={formData.years_experience}
              onChange={(e) => setFormData({ ...formData, years_experience: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Seniority Level</label>
            <select
              value={formData.seniority_level}
              onChange={(e) => setFormData({ ...formData, seniority_level: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange/50"
            >
              <option value="">Select level</option>
              {SENIORITY_LEVELS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Status & Preferences */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Status & Preferences</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/60 text-sm mb-2">Looking Status</label>
            <select
              value={formData.looking_status}
              onChange={(e) => setFormData({ ...formData, looking_status: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange/50"
            >
              {LOOKING_STATUSES.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Work Preference</label>
            <select
              value={formData.work_preference}
              onChange={(e) => setFormData({ ...formData, work_preference: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange/50"
            >
              <option value="">Select preference</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Preferred Locations</label>
            <input
              type="text"
              value={formData.preferred_locations}
              onChange={(e) => setFormData({ ...formData, preferred_locations: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
              placeholder="e.g. London, Remote UK, Europe"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Notice Period</label>
            <input
              type="text"
              value={formData.notice_period}
              onChange={(e) => setFormData({ ...formData, notice_period: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
              placeholder="e.g. 1 month, 3 months"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-white/60 text-sm mb-2">Salary Expectation</label>
            <input
              type="text"
              value={formData.salary_expectation}
              onChange={(e) => setFormData({ ...formData, salary_expectation: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
              placeholder="e.g. £70-80k, €90k+"
            />
          </div>
        </div>
      </div>

      {/* Initial Notes */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Initial Notes</h2>
        <textarea
          value={formData.raw_notes}
          onChange={(e) => setFormData({ ...formData, raw_notes: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50 resize-none"
          placeholder="Any initial observations or notes from first contact..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-ghost"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {candidate?.id ? "Save Changes" : "Create Candidate"}
        </button>
      </div>
    </form>
  );
}