"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { X, Plus } from "lucide-react";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface CompanyTagsProps {
  companyId: string;
  currentTags: Tag[];
  availableTags: Tag[];
}

export function CompanyTags({ companyId, currentTags, availableTags }: CompanyTagsProps) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const unassignedTags = availableTags.filter(
    (tag) => !currentTags.some((ct) => ct.id === tag.id)
  );

  async function addTag(tagId: string) {
    await supabase.from("company_tags").insert({
      company_id: companyId,
      tag_id: tagId,
    });
    setShowDropdown(false);
    router.refresh();
  }

  async function removeTag(tagId: string) {
    await supabase
      .from("company_tags")
      .delete()
      .eq("company_id", companyId)
      .eq("tag_id", tagId);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {currentTags.map((tag) => (
        <span
          key={tag.id}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm"
          style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
        >
          {tag.name}
          <button
            onClick={() => removeTag(tag.id)}
            className="hover:opacity-70 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add Tag
        </button>
        
        {showDropdown && unassignedTags.length > 0 && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-brand-black-light border border-white/10 rounded-xl shadow-xl z-10 overflow-hidden">
            {unassignedTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => addTag(tag.id)}
                className="w-full px-4 py-2 text-left text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                {tag.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}