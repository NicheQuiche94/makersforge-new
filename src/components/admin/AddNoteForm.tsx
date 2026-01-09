"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Send, Loader2 } from "lucide-react";

interface AddNoteFormProps {
  entityType: "company" | "candidate";
  entityId: string;
}

export function AddNoteForm({ entityType, entityId }: AddNoteFormProps) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;

    setSaving(true);

    if (entityType === "company") {
      await supabase.from("company_notes").insert({
        company_id: entityId,
        note: note.trim(),
      });
    }
    // For candidates, we update raw_notes directly on candidate_profiles
    // (handled separately in candidate detail page)

    // Log activity
    await supabase.from("activity_log").insert({
      entity_type: entityType,
      entity_id: entityId,
      activity_type: "note",
      description: `Note added: "${note.trim().substring(0, 50)}${note.length > 50 ? "..." : ""}"`,
    });

    setNote("");
    setSaving(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note..."
        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
      />
      <button
        type="submit"
        disabled={saving || !note.trim()}
        className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange/90 disabled:opacity-50 transition-colors"
      >
        {saving ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </button>
    </form>
  );
}