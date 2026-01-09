"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Check } from "lucide-react";

const BD_STATUSES = [
  { key: "lead", label: "Lead", color: "bg-gray-500" },
  { key: "contacted", label: "Contacted", color: "bg-blue-500" },
  { key: "meeting", label: "Meeting", color: "bg-purple-500" },
  { key: "proposal", label: "Proposal", color: "bg-yellow-500" },
  { key: "client", label: "Client", color: "bg-green-500" },
];

interface CompanyStatusSelectorProps {
  companyId: string;
  currentStatus: string;
  isClient: boolean;
}

export function CompanyStatusSelector({ 
  companyId, 
  currentStatus,
  isClient 
}: CompanyStatusSelectorProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  async function updateStatus(newStatus: string) {
    if (newStatus === currentStatus) return;
    setUpdating(true);

    const updates: any = {
      bd_status: newStatus,
      updated_at: new Date().toISOString(),
    };

    // Auto-set is_client when status becomes "client"
    if (newStatus === "client") {
      updates.is_client = true;
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
      description: `Status changed from ${currentStatus} to ${newStatus}`,
      metadata: { old_status: currentStatus, new_status: newStatus },
    });

    router.refresh();
    setUpdating(false);
  }

  const currentIndex = BD_STATUSES.findIndex(s => s.key === currentStatus);

  return (
    <div className="relative">
      {/* Progress bar */}
      <div className="flex gap-1 mb-4">
        {BD_STATUSES.map((status, index) => (
          <div
            key={status.key}
            className={`h-2 flex-1 rounded-full transition-colors ${
              index <= currentIndex ? status.color : "bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* Status buttons */}
      <div className="flex gap-2 flex-wrap">
        {BD_STATUSES.map((status) => {
          const isActive = status.key === currentStatus;
          return (
            <button
              key={status.key}
              onClick={() => updateStatus(status.key)}
              disabled={updating}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                isActive
                  ? `${status.color} text-white`
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {isActive && <Check className="w-4 h-4" />}
              {status.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}