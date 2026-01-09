"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Target, Loader2 } from "lucide-react";

interface ConvertToLeadButtonProps {
  companyId: string;
  isLead: boolean;
}

export function ConvertToLeadButton({ companyId, isLead }: ConvertToLeadButtonProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  async function toggleLead() {
    setUpdating(true);

    const updates: any = {
      is_lead: !isLead,
      updated_at: new Date().toISOString(),
    };

    // If converting to lead, set initial bd_status
    if (!isLead) {
      updates.bd_status = "lead";
    }

    await supabase
      .from("companies")
      .update(updates)
      .eq("id", companyId);

    // Log activity
    await supabase.from("activity_log").insert({
      entity_type: "company",
      entity_id: companyId,
      activity_type: "status_change",
      description: isLead ? "Removed from leads" : "Converted to lead",
    });

    setUpdating(false);
    router.refresh();
  }

  return (
    <button
      onClick={toggleLead}
      disabled={updating}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        isLead
          ? "bg-brand-orange text-white hover:bg-brand-orange/80"
          : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
      }`}
    >
      {updating ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Target className="w-3 h-3" />
      )}
      {isLead ? "Lead" : "Convert to Lead"}
    </button>
  );
}