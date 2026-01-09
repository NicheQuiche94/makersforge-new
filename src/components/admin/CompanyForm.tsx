"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

const COMPANY_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "500+",
];

const BD_STATUSES = [
  { key: "lead", label: "Lead" },
  { key: "contacted", label: "Contacted" },
  { key: "meeting", label: "Meeting" },
  { key: "proposal", label: "Proposal" },
  { key: "client", label: "Client" },
  { key: "churned", label: "Churned" },
  { key: "not_interested", label: "Not Interested" },
];

const REMOTE_POLICIES = [
  { key: "remote", label: "Fully Remote" },
  { key: "hybrid", label: "Hybrid" },
  { key: "onsite", label: "On-site Only" },
  { key: "flexible", label: "Flexible" },
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
    website: company?.website || "",
    linkedin_url: company?.linkedin_url || "",
    size: company?.size || "",
    location: company?.location || "",
    industry: company?.industry || "Mobile Gaming",
    game_categories: company?.game_categories || "",
    remote_policy: company?.remote_policy || "",
    actively_hiring: company?.actively_hiring || false,
    is_lead: company?.is_lead || false,
    bd_status: company?.bd_status || "lead",
    point_of_contact: company?.point_of_contact || "",
    poc_email: company?.poc_email || "",
    poc_phone: company?.poc_phone || "",
    poc_linkedin: company?.poc_linkedin || "",
    is_client: company?.is_client || false,
    notes: company?.notes || "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...formData,
        // Only set bd_status if it's a lead
        bd_status: formData.is_lead ? formData.bd_status : null,
        updated_at: new Date().toISOString(),
      };

      if (company?.id) {
        const { error } = await supabase
          .from("companies")
          .update(payload)
          .eq("id", company.id);

        if (error) throw error;

        await supabase.from("activity_log").insert({
          entity_type: "company",
          entity_id: company.id,
          activity_type: "updated",
          description: `Updated company: ${formData.name}`,
        });

        router.push(`/admin/companies/${company.id}`);
      } else {
        const { data, error } = await supabase
          .from("companies")
          .insert(payload)
          .select()
          .single();

        if (error) throw error;

        await supabase.from("activity_log").insert({
          entity_type: "company",
          entity_id: data.id,
          activity_type: "created",
          description: `Created company: ${formData.name}`,
        });

        router.push(`/admin/companies/${data.id}`);
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
            <label className="block text-white/60 text-sm mb-2">Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
              placeholder="https://supercell.com"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">LinkedIn</label>
            <input
              type="url"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
              placeholder="https://linkedin.com/company/..."
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
              placeholder="Helsinki, Finland"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Headcount</label>
            <select
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange/50"
            >
              <option value="">Select size</option>
              {COMPANY_SIZES.map((size) => (
                <option key={size} value={size}>{size} employees</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Game Categories</label>
            <input
              type="text"
              value={formData.game_categories}
              onChange={(e) => setFormData({ ...formData, game_categories: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
              placeholder="e.g. Puzzle, RPG, Strategy"
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

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-white/10">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.actively_hiring}
              onChange={(e) => setFormData({ ...formData, actively_hiring: e.target.checked })}
              className="w-5 h-5 rounded border-white/20 bg-white/5 text-brand-orange focus:ring-brand-orange"
            />
            <span className="text-white">Actively Hiring</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_client}
              onChange={(e) => setFormData({ ...formData, is_client: e.target.checked })}
              className="w-5 h-5 rounded border-white/20 bg-white/5 text-brand-orange focus:ring-brand-orange"
            />
            <span className="text-white">Active Client</span>
          </label>
        </div>
      </div>

      {/* BD Info */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Business Development</h2>
        
        <label className="flex items-center gap-3 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={formData.is_lead}
            onChange={(e) => setFormData({ ...formData, is_lead: e.target.checked })}
            className="w-5 h-5 rounded border-white/20 bg-white/5 text-brand-orange focus:ring-brand-orange"
          />
          <span className="text-white">This is an active BD lead</span>
        </label>

        {formData.is_lead && (
          <div>
            <label className="block text-white/60 text-sm mb-2">BD Stage</label>
            <select
              value={formData.bd_status}
              onChange={(e) => setFormData({ ...formData, bd_status: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange/50"
            >
              {BD_STATUSES.map((status) => (
                <option key={status.key} value={status.key}>{status.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Contact Info */}
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
              placeholder="John Smith"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Email</label>
            <input
              type="email"
              value={formData.poc_email}
              onChange={(e) => setFormData({ ...formData, poc_email: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
              placeholder="john@company.com"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Phone</label>
            <input
              type="tel"
              value={formData.poc_phone}
              onChange={(e) => setFormData({ ...formData, poc_phone: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
              placeholder="+44 123 456 7890"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">LinkedIn Profile</label>
            <input
              type="url"
              value={formData.poc_linkedin}
              onChange={(e) => setFormData({ ...formData, poc_linkedin: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
              placeholder="https://linkedin.com/in/..."
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Notes</h2>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50 resize-none"
          placeholder="Any additional notes about this company..."
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
          {company?.id ? "Save Changes" : "Create Company"}
        </button>
      </div>
    </form>
  );
}