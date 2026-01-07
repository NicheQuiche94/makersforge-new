"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ChevronDown, MessageSquare, Loader2, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  discipline: string;
  experience_level?: string;
}

interface Feedback {
  id: string;
  stage: string;
  feedback_text: string;
  created_at: string;
}

interface CandidateProcess {
  id: string;
  status: string;
  current_interview_stage: string;
  candidate: Candidate;
  feedback: Feedback[];
}

interface Props {
  processId: string;
  interviewStages: string[];
  candidateProcesses: CandidateProcess[];
  availableCandidates: Candidate[];
}

export function ProcessCandidateManager({
  processId,
  interviewStages,
  candidateProcesses,
  availableCandidates,
}: Props) {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackStage, setFeedbackStage] = useState("");
  const [loading, setLoading] = useState(false);

  async function addCandidate() {
    if (!selectedCandidate) return;
    setLoading(true);

    await supabase.from("candidate_processes").insert([
      {
        process_id: processId,
        candidate_id: selectedCandidate,
        status: "active",
        current_interview_stage: interviewStages[0] || "Screening",
      },
    ]);

    setSelectedCandidate("");
    setShowAddModal(false);
    setLoading(false);
    router.refresh();
  }

  async function updateStage(candidateProcessId: string, stage: string) {
    await supabase
      .from("candidate_processes")
      .update({ current_interview_stage: stage })
      .eq("id", candidateProcessId);

    router.refresh();
  }

  async function addFeedback(candidateProcessId: string) {
    if (!feedbackText || !feedbackStage) return;
    setLoading(true);

    await supabase.from("process_feedback").insert([
      {
        candidate_process_id: candidateProcessId,
        stage: feedbackStage,
        feedback_text: feedbackText,
      },
    ]);

    // Mark feedback as received on candidate_processes
    await supabase
      .from("candidate_processes")
      .update({ feedback_received: true })
      .eq("id", candidateProcessId);

    setFeedbackText("");
    setFeedbackStage("");
    setShowFeedbackModal(null);
    setLoading(false);
    router.refresh();
  }

  async function removeCandidate(candidateProcessId: string) {
    if (!confirm("Remove this candidate from the process?")) return;

    await supabase
      .from("candidate_processes")
      .delete()
      .eq("id", candidateProcessId);

    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          Candidates ({candidateProcesses.length})
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary inline-flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Candidate
        </button>
      </div>

      {/* Candidates List */}
      <div className="space-y-4">
        {candidateProcesses.map((cp: any) => (
          <div key={cp.id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {cp.candidate?.first_name} {cp.candidate?.last_name}
                </h3>
                <p className="text-white/60 text-sm">
                  {cp.candidate?.discipline} · {cp.candidate?.experience_level}
                </p>
              </div>
              <button
                onClick={() => removeCandidate(cp.id)}
                className="text-white/30 hover:text-red-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stage Selector */}
            <div className="mb-4">
              <label className="block text-sm text-white/50 mb-2">Current Stage</label>
              <select
                value={cp.current_interview_stage || ""}
                onChange={(e) => updateStage(cp.id, e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-orange/50"
              >
                {interviewStages.map((stage) => (
                  <option key={stage} value={stage} className="bg-brand-black">
                    {stage}
                  </option>
                ))}
              </select>
            </div>

            {/* Feedback Section */}
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-white/50">Feedback</span>
                <button
                  onClick={() => {
                    setShowFeedbackModal(cp.id);
                    setFeedbackStage(cp.current_interview_stage || interviewStages[0]);
                  }}
                  className="text-sm text-brand-orange hover:text-brand-orange/80 inline-flex items-center gap-1"
                >
                  <MessageSquare className="w-4 h-4" />
                  Add Feedback
                </button>
              </div>

              {cp.feedback && cp.feedback.length > 0 ? (
                <div className="space-y-3">
                  {cp.feedback.map((fb: Feedback) => (
                    <div key={fb.id} className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-brand-orange">
                          {fb.stage}
                        </span>
                        <span className="text-xs text-white/40">
                          {new Date(fb.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-white/70">{fb.feedback_text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/30">No feedback yet</p>
              )}
            </div>
          </div>
        ))}

        {candidateProcesses.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-white/40 mb-4">No candidates in this process yet</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add First Candidate
            </button>
          </div>
        )}
      </div>

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="card p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">Add Candidate</h3>
            
            {availableCandidates.length > 0 ? (
              <>
                <select
                  value={selectedCandidate}
                  onChange={(e) => setSelectedCandidate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-orange/50 mb-4"
                >
                  <option value="" className="bg-brand-black">Select a candidate...</option>
                  {availableCandidates.map((c) => (
                    <option key={c.id} value={c.id} className="bg-brand-black">
                      {c.first_name} {c.last_name} - {c.discipline}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addCandidate}
                    disabled={!selectedCandidate || loading}
                    className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Add to Process
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-white/60 mb-4">
                  All candidates are already in this process.
                </p>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary w-full"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Add Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="card p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">Add Feedback</h3>
            
            <div className="mb-4">
              <label className="block text-sm text-white/50 mb-2">Stage</label>
              <select
                value={feedbackStage}
                onChange={(e) => setFeedbackStage(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-orange/50"
              >
                {interviewStages.map((stage) => (
                  <option key={stage} value={stage} className="bg-brand-black">
                    {stage}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-white/50 mb-2">Feedback</label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-orange/50"
                placeholder="Enter feedback for this stage..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowFeedbackModal(null);
                  setFeedbackText("");
                }}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={() => addFeedback(showFeedbackModal)}
                disabled={!feedbackText || loading}
                className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Save Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}