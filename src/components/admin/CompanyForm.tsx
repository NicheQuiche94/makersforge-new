"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

const REMOTE_POLICIES = [
  { key: "remote", label: "Remote" },
  { key: "hybrid", label: "Hybrid" },
  { key: "onsite", label: "On-site" },
  { key: "flexible", label: "Flexible" },
];

const COMPANY_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
];

interface CompanyFormProps {
  company?: any;
}

export function CompanyForm({ company }: CompanyFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: company?.name || "",
    location: company?.location || "",
    website: company?.website || "",
    linkedin_url: company?.linkedin_url || "",
    size: company?.size || "",
    industry: company?.industry || "",
    game_categories: company?.game_categories || "",
    remote_policy: company?.remote_policy || "",
    point_of_contact: company?.point_of_contact || "",
    poc_email: company?.poc_email || "",
    poc_phone: company?.poc_phone || "",
    actively_hiring: company?.actively_hiring || false,
    is_client: company?.is_client || false,
    is_lead: company?.is_lead || false,
    bd_status: company?.bd_status || "lead",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      let companyId = company?.id;

      if (company?.id) {
        // Update existing
        const { error: updateError } = await supabase
          .from("companies")
          .update(payload)
          .eq("id", company.id);

        if (updateError) throw updateError;

        // Log activity
        await supabase.from("activity_log").insert({
          entity_type: "company",
          entity_id: company.id,
          activity_type: "updated",
          description: `Updated company: ${formData.name}`,
        });
      } else {
        // Create new
        const { data, error: insertError } = await supabase
          .from("companies")
          .insert(payload)
          .select()
          .single();

        if (insertError) throw insertError;
        if (!data) throw new Error("No data returned from insert");

        companyId = data.id;

        // Log activity
        await supabase.from("activity_log").insert({
          entity_type: "company",
          entity_id: data.id,
          activity_type: "created",
          description: `Created company: ${formData.name}`,
        });
      }

      router.push(`/admin/companies/${companyId}`);
      router.refresh();
    } catch (err: any) {
      console.error("Company save error:", err);
      setError(err.message || "Something went wrong");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Company Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-white/60 text-sm mb-2">Company Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
              placeholder="e.g. Supercell"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
              placeholder="e.g. Helsinki, Finland"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Company Size</label>
            <select
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange/50"
            >
              <option value="">Select size</option>
              {COMPANY_SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Industry</label>
            <input
              type="text"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
              placeholder="e.g. Mobile Gaming"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Game Categories</label>
            <input
              type="text"
              value={formData.game_categories}
              onChange={(e) => setFormData({ ...formData, game_categories: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
              placeholder="e.g. F2P, Puzzle, Strategy"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Remote Policy</label>
            <select
              value={formData.remote_policy}
              onChange={(e) => setFormData({ ...formData, remote_policy: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange/50"
            >
              <option value="">Select policy</option>
              {REMOTE_POLICIES.map((p) => (
                <option key={p.key} value={p.key}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Links</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/60 text-sm mb-2">Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">LinkedIn URL</label>
            <input
              type="url"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
              placeholder="https://linkedin.com/company/..."
            />
          </div>
        </div>
      </div>

      {/* Point of Contact */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Point of Contact</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/60 text-sm mb-2">Contact Name</label>
            <input
              type="text"
              value={formData.point_of_contact}
              onChange={(e) => setFormData({ ...formData, point_of_contact: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
              placeholder="e.g. John Smith"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Contact Email</label>
            <input
              type="email"
              value={formData.poc_email}
              onChange={(e) => setFormData({ ...formData, poc_email: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
              placeholder="john@company.com"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Contact Phone</label>
            <input
              type="tel"
              value={formData.poc_phone}
              onChange={(e) => setFormData({ ...formData, poc_phone: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
              placeholder="+1 234 567 8900"
            />
          </div>
        </div>
      </div>

      {/* Status Flags */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Status</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.actively_hiring}
              onChange={(e) => setFormData({ ...formData, actively_hiring: e.target.checked })}
              className="w-5 h-5 rounded bg-white/5 border-white/20 text-brand-orange focus:ring-brand-orange/50"
            />
            <span className="text-white">Actively Hiring</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_client}
              onChange={(e) => setFormData({ ...formData, is_client: e.target.checked })}
              className="w-5 h-5 rounded bg-white/5 border-white/20 text-brand-orange focus:ring-brand-orange/50"
            />
            <span className="text-white">Is Client</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_lead}
              onChange={(e) => setFormData({ ...formData, is_lead: e.target.checked })}
              className="w-5 h-5 rounded bg-white/5 border-white/20 text-brand-orange focus:ring-brand-orange/50"
            />
            <span className="text-white">Is Lead (BD Pipeline)</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-brand-orange text-white rounded-xl hover:bg-brand-orange/90 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {company?.id ? "Save Changes" : "Create Company"}
        </button>
      </div>
    </form>
  );
}
