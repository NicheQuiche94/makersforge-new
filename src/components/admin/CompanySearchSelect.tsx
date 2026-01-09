"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Search, Plus, X, Loader2, Building2 } from "lucide-react";

interface Company {
  id: string;
  name: string;
  location?: string;
}

interface CompanySearchSelectProps {
  selectedCompany: Company | null;
  onSelect: (company: Company | null) => void;
  placeholder?: string;
}

export function CompanySearchSelect({ 
  selectedCompany, 
  onSelect,
  placeholder = "Search or create company..."
}: CompanySearchSelectProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Company[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  // Search companies
  useEffect(() => {
    async function searchCompanies() {
      if (search.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      const { data } = await supabase
        .from("companies")
        .select("id, name, location")
        .ilike("name", `%${search}%`)
        .order("name")
        .limit(8);

      setResults(data || []);
      setLoading(false);
    }

    const timeout = setTimeout(searchCompanies, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  async function createCompany() {
    if (!search.trim()) return;
    setCreating(true);

    const { data, error } = await supabase
      .from("companies")
      .insert({ name: search.trim() })
      .select("id, name, location")
      .single();

    if (data && !error) {
      onSelect(data);
      setSearch("");
      setShowDropdown(false);

      // Log activity
      await supabase.from("activity_log").insert({
        entity_type: "company",
        entity_id: data.id,
        activity_type: "created",
        description: `Quick-created company: ${data.name}`,
      });
    }
    setCreating(false);
  }

  if (selectedCompany) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
        <Building2 className="w-4 h-4 text-white/40" />
        <span className="text-white flex-1">{selectedCompany.name}</span>
        {selectedCompany.location && (
          <span className="text-white/40 text-sm">{selectedCompany.location}</span>
        )}
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="text-white/40 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
          placeholder={placeholder}
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 animate-spin" />
        )}
      </div>

      {showDropdown && (results.length > 0 || search.length >= 2) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-brand-black-light border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden max-h-64 overflow-y-auto">
          {results.map((company) => (
            <button
              key={company.id}
              type="button"
              onClick={() => {
                onSelect(company);
                setSearch("");
                setShowDropdown(false);
              }}
              className="w-full px-4 py-3 text-left text-white/70 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-3"
            >
              <Building2 className="w-4 h-4 text-white/40" />
              <div>
                <p className="font-medium">{company.name}</p>
                {company.location && (
                  <p className="text-sm text-white/40">{company.location}</p>
                )}
              </div>
            </button>
          ))}
          
          {search.length >= 2 && (
            <button
              type="button"
              onClick={createCompany}
              disabled={creating}
              className="w-full px-4 py-3 text-left text-brand-orange hover:bg-white/10 transition-colors flex items-center gap-3 border-t border-white/10"
            >
              {creating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>Create "{search}"</span>
            </button>
          )}
          
          {search.length >= 2 && results.length === 0 && !loading && (
            <p className="px-4 py-3 text-white/40 text-sm">
              No companies found matching "{search}"
            </p>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}