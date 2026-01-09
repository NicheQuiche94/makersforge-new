"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Check, X, Loader2 } from "lucide-react";

interface ToggleFieldProps {
  companyId: string;
  field: string;
  value: boolean;
  label?: string;
}

export function ToggleField({ companyId, field, value, label }: ToggleFieldProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  async function toggle() {
    setUpdating(true);

    await supabase
      .from("companies")
      .update({ 
        [field]: !value,
        updated_at: new Date().toISOString()
      })
      .eq("id", companyId);

    setUpdating(false);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={updating}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
        value
          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
          : "bg-white/10 text-white/60 hover:bg-white/20"
      }`}
    >
      {updating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : value ? (
        <Check className="w-4 h-4" />
      ) : (
        <X className="w-4 h-4" />
      )}
      {label || (value ? "Yes" : "No")}
    </button>
  );
}