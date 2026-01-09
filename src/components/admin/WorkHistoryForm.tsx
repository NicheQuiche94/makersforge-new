"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Loader2, Search, Plus, X } from "lucide-react";

interface WorkHistoryFormProps {
  candidateId: string;
  existingEntry?: {
    id: string;
    company_id: string;
    job_title: string;
    is_current: boolean;
    start_date?: string;
    end_date?: string;
    company: { id: string; name: string };
  };
}

export function WorkHistoryForm({ candidateId, existingEntry }: WorkHistoryFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Company search
  const [companySearch, setCompanySearch] = useState("");
  const [companyResults, setCompanyResults] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any>(existingEntry?.company || null);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [creatingCompany, setCreatingCompany] = useState(false);

  const [formData, setFormData] = useState({
    job_title: existingEntry?.job_title || "",
    is_current: existingEntry?.is_current || false,
    start_date: existingEntry?.start_date || "",
    end_date: existingEntry?.end_date || "",
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
    
    if (!selectedCompany) {
      setError("Please select a company");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        candidate_id: candidateId,
        company_id: selectedCompany.id,
        job_title: formData.job_title,
        is_current: formData.is_current,
        start_date: formData.start_date || null,
        end_date: formData.is_current ? null : (formData.end_date || null),
      };

      if (existingEntry?.id) {
        const { error } = await supabase
          .from("candidate_companies")
          .update(payload)
          .eq("id", existingEntry.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("candidate_companies")
          .insert(payload);

        if (error) throw error;

        // If marking as current, update candidate's current_company_id
        if (formData.is_current) {
          await supabase
            .from("candidate_profiles")
            .update({ current_company_id: selectedCompany.id })
            .eq("id", candidateId);
        }
      }

      // Log activity
      await supabase.from("activity_log").insert({
        entity_type: "candidate",
        entity_id: candidateId,
        activity_type: "updated",
        description: `Added work history: ${formData.job_title} at ${selectedCompany.name}`,
      });

      router.push(`/admin/candidates/${candidateId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        {/* Company Search */}
        <div className="relative">
          <label className="block text-white/60 text-sm mb-2">Company *</label>
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
          <label className="block text-white/60 text-sm mb-2">Job Title</label>
          <input
            type="text"
            value={formData.job_title}
            onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
            placeholder="e.g. Senior Game Designer"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_current"
            checked={formData.is_current}
            onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
            className="w-5 h-5 rounded border-white/20 bg-white/5 text-brand-orange focus:ring-brand-orange"
          />
          <label htmlFor="is_current" className="text-white">Currently working here</label>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/60 text-sm mb-2">Start Date</label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange/50"
            />
          </div>
          {!formData.is_current && (
            <div>
              <label className="block text-white/60 text-sm mb-2">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange/50"
              />
            </div>
          )}
        </div>
      </div>

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
          {existingEntry ? "Save Changes" : "Add Work History"}
        </button>
      </div>
    </form>
  );
}