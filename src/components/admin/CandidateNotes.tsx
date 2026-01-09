"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Save, Loader2 } from "lucide-react";

interface CandidateNotesProps {
  candidateId: string;
  rawNotes: string;
  recruiterSummary: string;
}

export function CandidateNotes({ candidateId, rawNotes, recruiterSummary }: CandidateNotesProps) {
  const router = useRouter();
  const [rawNotesValue, setRawNotesValue] = useState(rawNotes);
  const [summaryValue, setSummaryValue] = useState(recruiterSummary);
  const [savingRaw, setSavingRaw] = useState(false);
  const [savingSummary, setSavingSummary] = useState(false);
  const [rawSaved, setRawSaved] = useState(false);
  const [summarySaved, setSummarySaved] = useState(false);

  async function saveRawNotes() {
    setSavingRaw(true);
    setRawSaved(false);

    await supabase
      .from("candidate_profiles")
      .update({
        raw_notes: rawNotesValue,
        updated_at: new Date().toISOString()
      })
      .eq("id", candidateId);

    // Log activity
    await supabase.from("activity_log").insert({
      entity_type: "candidate",
      entity_id: candidateId,
      activity_type: "note",
      description: "Updated raw notes",
    });

    setSavingRaw(false);
    setRawSaved(true);
    setTimeout(() => setRawSaved(false), 2000);
    router.refresh();
  }

  async function saveSummary() {
    setSavingSummary(true);
    setSummarySaved(false);

    await supabase
      .from("candidate_profiles")
      .update({
        recruiter_summary: summaryValue,
        updated_at: new Date().toISOString()
      })
      .eq("id", candidateId);

    // Log activity
    await supabase.from("activity_log").insert({
      entity_type: "candidate",
      entity_id: candidateId,
      activity_type: "note",
      description: "Updated recruiter summary",
    });

    setSavingSummary(false);
    setSummarySaved(true);
    setTimeout(() => setSummarySaved(false), 2000);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Raw Notes */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Raw Notes</h2>
            <p className="text-white/40 text-sm">Call logs, interactions, observations</p>
          </div>
          <button
            onClick={saveRawNotes}
            disabled={savingRaw || rawNotesValue === rawNotes}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              rawSaved
                ? "bg-green-500 text-white"
                : rawNotesValue !== rawNotes
                  ? "bg-brand-orange text-white hover:bg-brand-orange/90"
                  : "bg-white/10 text-white/40"
            }`}
          >
            {savingRaw ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : rawSaved ? (
              "Saved!"
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save
              </>
            )}
          </button>
        </div>
        <textarea
          value={rawNotesValue}
          onChange={(e) => setRawNotesValue(e.target.value)}
          rows={8}
          placeholder="Add call notes, interactions, observations...

Example:
15/01 - Initial call, very interested in senior roles at funded studios. Currently at [Company], unhappy with direction. 3 month notice.

18/01 - Sent role at XYZ Games, waiting for response..."
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50 resize-none font-mono text-sm"
        />
      </div>

      {/* Recruiter Summary */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Recruiter Summary</h2>
            <p className="text-white/40 text-sm">Polished overview for company portal</p>
          </div>
          <button
            onClick={saveSummary}
            disabled={savingSummary || summaryValue === recruiterSummary}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              summarySaved
                ? "bg-green-500 text-white"
                : summaryValue !== recruiterSummary
                  ? "bg-brand-orange text-white hover:bg-brand-orange/90"
                  : "bg-white/10 text-white/40"
            }`}
          >
            {savingSummary ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : summarySaved ? (
              "Saved!"
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save
              </>
            )}
          </button>
        </div>
        <textarea
          value={summaryValue}
          onChange={(e) => setSummaryValue(e.target.value)}
          rows={6}
          placeholder="A polished summary of this candidate for sharing with clients...

Example:
A senior game designer with 8 years in mobile F2P, specializing in economy design and monetisation. Strong portfolio including work on [Game] which achieved $10M+ revenue. Looking for a lead role at a funded studio with creative ownership."
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50 resize-none"
        />
      </div>
    </div>
  );
}
