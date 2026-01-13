"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, MessageSquare, Loader2, X, GripVertical, Send, Paperclip, FileText, Download, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  discipline: string;
  experience_level?: string;
}

interface Reply {
  id: string;
  message: string;
  is_from_admin: boolean;
  created_at: string;
}

interface Attachment {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
}

interface Feedback {
  id: string;
  stage: string;
  feedback_text: string;
  created_at: string;
  replies?: Reply[];
  attachments?: Attachment[];
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
  processTitle: string;
  companyName: string;
  candidateProcesses: CandidateProcess[];
  availableCandidates: Candidate[];
}

const STATUSES = [
  { key: "contacted", label: "Contacted" },
  { key: "screening", label: "Screening" },
  { key: "submitted", label: "Submitted" },
  { key: "interviewing", label: "Interviewing" },
  { key: "offer", label: "Offer" },
  { key: "placed", label: "Placed" },
];

const INTERVIEW_STAGES = ["1st", "2nd", "3rd", "4th", "5th"];

export function ProcessKanban({
  processId,
  processTitle,
  companyName,
  candidateProcesses,
  availableCandidates,
}: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<CandidateProcess | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackStage, setFeedbackStage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [replyText, setReplyText] = useState("");
  const [replyingToFeedback, setReplyingToFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Group candidates by status
  const candidatesByStatus = STATUSES.reduce((acc, status) => {
    acc[status.key] = candidateProcesses.filter((cp) => cp.status === status.key);
    return acc;
  }, {} as Record<string, CandidateProcess[]>);

  async function sendStatusNotification(
    candidate: Candidate,
    newStatus: string,
    interviewStage?: string | null
  ) {
    try {
      let stage = newStatus;
      if (newStatus === "interviewing" && interviewStage) {
        stage = `${interviewStage}_interview`;
      }
      
      await fetch("/api/email/notify-candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName: `${candidate.first_name} ${candidate.last_name}`,
          candidateEmail: candidate.email,
          companyName: companyName,
          newStage: stage,
        }),
      });
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  }

  async function sendFeedbackNotification(
    candidate: Candidate,
    stage: string,
    feedbackPreview: string
  ) {
    try {
      await fetch("/api/email/notify-candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName: `${candidate.first_name} ${candidate.last_name}`,
          candidateEmail: candidate.email,
          companyName: companyName,
          newStage: `${stage.toLowerCase().replace(" ", "_")}_feedback`,
        }),
      });
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  }

  async function addCandidate() {
    if (!selectedCandidate) return;
    setLoading(true);

    await supabase.from("candidate_processes").insert([
      {
        process_id: processId,
        candidate_id: selectedCandidate,
        status: "contacted",
        current_interview_stage: null,
      },
    ]);

    const candidate = availableCandidates.find((c) => c.id === selectedCandidate);
    if (candidate) {
      await sendStatusNotification(candidate, "contacted");
    }

    setSelectedCandidate("");
    setShowAddModal(false);
    setLoading(false);
    router.refresh();
  }

  async function updateStatus(candidateProcessId: string, newStatus: string) {
    const cp = candidateProcesses.find((c) => c.id === candidateProcessId);
    if (!cp) return;

    const updateData: any = { status: newStatus };

    if (newStatus === "interviewing") {
      updateData.current_interview_stage = "1st";
    }
    if (newStatus !== "interviewing") {
      updateData.current_interview_stage = null;
    }

    await supabase
      .from("candidate_processes")
      .update(updateData)
      .eq("id", candidateProcessId);

    if (cp.candidate) {
      await sendStatusNotification(
        cp.candidate,
        newStatus,
        newStatus === "interviewing" ? "1st" : null
      );
    }

    router.refresh();
  }

  async function updateInterviewStage(candidateProcessId: string, stage: string) {
    const cp = candidateProcesses.find((c) => c.id === candidateProcessId);

    await supabase
      .from("candidate_processes")
      .update({ current_interview_stage: stage })
      .eq("id", candidateProcessId);

    if (cp?.candidate) {
      await sendStatusNotification(cp.candidate, "interviewing", stage);
    }

    router.refresh();
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  }

  function removeSelectedFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function uploadFiles(feedbackId: string): Promise<void> {
    for (const file of selectedFiles) {
      const fileExt = file.name.split(".").pop();
      const filePath = `${processId}/${feedbackId}/${Date.now()}-${file.name}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("feedback-files")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        continue;
      }

      // Save attachment record
      await supabase.from("feedback_attachments").insert({
        feedback_id: feedbackId,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
      });
    }
  }

  async function addFeedback() {
    if (!feedbackText || !feedbackStage || !showFeedbackModal) return;
    setLoading(true);

    const { data: feedback, error } = await supabase
      .from("process_feedback")
      .insert([
        {
          candidate_process_id: showFeedbackModal.id,
          stage: feedbackStage,
          feedback_text: feedbackText,
        },
      ])
      .select()
      .single();

    if (error || !feedback) {
      console.error("Failed to create feedback:", error);
      setLoading(false);
      return;
    }

    // Upload files if any
    if (selectedFiles.length > 0) {
      await uploadFiles(feedback.id);
    }

    await supabase
      .from("candidate_processes")
      .update({ feedback_received: true })
      .eq("id", showFeedbackModal.id);

    if (showFeedbackModal.candidate) {
      await sendFeedbackNotification(
        showFeedbackModal.candidate,
        feedbackStage,
        feedbackText
      );
    }

    setFeedbackText("");
    setFeedbackStage("");
    setSelectedFiles([]);
    setShowFeedbackModal(null);
    setLoading(false);
    router.refresh();
  }

  async function addReply(feedbackId: string) {
    if (!replyText.trim()) return;
    setLoading(true);

    await supabase.from("feedback_replies").insert([
      {
        feedback_id: feedbackId,
        message: replyText.trim(),
        is_from_admin: true,
      },
    ]);

    setReplyText("");
    setReplyingToFeedback(null);
    setLoading(false);
    router.refresh();
  }

  async function removeCandidate(candidateProcessId: string) {
    if (!confirm("Remove this candidate from the process?")) return;

    await supabase.from("candidate_processes").delete().eq("id", candidateProcessId);

    router.refresh();
  }

  async function downloadFile(attachment: Attachment) {
    const { data, error } = await supabase.storage
      .from("feedback-files")
      .download(attachment.file_path);

    if (error || !data) {
      console.error("Download error:", error);
      return;
    }

    // Create download link
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = attachment.file_name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function handleDragStart(e: React.DragEvent, candidateProcessId: string) {
    setDraggedItem(candidateProcessId);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(e: React.DragEvent, status: string) {
    e.preventDefault();
    if (draggedItem) {
      updateStatus(draggedItem, status);
      setDraggedItem(null);
    }
  }

  function handleDragEnd() {
    setDraggedItem(null);
  }

  function getTotalMessages(cp: CandidateProcess) {
    if (!cp.feedback) return 0;
    return cp.feedback.reduce((acc, fb) => acc + 1 + (fb.replies?.length || 0), 0);
  }

  function hasUnreadReplies(cp: CandidateProcess) {
    if (!cp.feedback) return false;
    return cp.feedback.some(
      (fb) => fb.replies && fb.replies.some((r) => !r.is_from_admin)
    );
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

      {/* Kanban Board */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {STATUSES.map((status, index) => (
          <div
            key={status.key}
            className="flex-shrink-0 w-56"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status.key)}
          >
            {/* Column Header */}
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="w-5 h-5 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
              <h3 className="font-medium text-white text-sm">{status.label}</h3>
              <span className="text-white/40 text-xs ml-auto">
                {candidatesByStatus[status.key]?.length || 0}
              </span>
            </div>

            {/* Column Content */}
            <div className="bg-white/5 rounded-lg p-2 min-h-[400px]">
              <div className="space-y-2">
                {candidatesByStatus[status.key]?.map((cp) => (
                  <div
                    key={cp.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, cp.id)}
                    onDragEnd={handleDragEnd}
                    className={`bg-brand-black border border-white/10 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all ${
                      draggedItem === cp.id ? "opacity-50" : ""
                    } ${hasUnreadReplies(cp) ? "border-green-500/50" : ""}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-3 h-3 text-white/30" />
                        <div>
                          <p className="font-medium text-white text-sm">
                            {cp.candidate?.first_name} {cp.candidate?.last_name}
                          </p>
                          <p className="text-xs text-white/50">{cp.candidate?.discipline}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeCandidate(cp.id)}
                        className="text-white/30 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Interview Stage Selector */}
                    {status.key === "interviewing" && (
                      <div className="mb-2">
                        <select
                          value={cp.current_interview_stage || "1st"}
                          onChange={(e) => updateInterviewStage(cp.id, e.target.value)}
                          className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-brand-orange/50"
                        >
                          {INTERVIEW_STAGES.map((stage) => (
                            <option key={stage} value={stage} className="bg-brand-black">
                              {stage} Interview
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Feedback indicator & button */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span
                        className={`text-xs ${
                          hasUnreadReplies(cp) ? "text-green-400 font-medium" : "text-white/40"
                        }`}
                      >
                        {getTotalMessages(cp)} messages
                        {hasUnreadReplies(cp) && " • New"}
                      </span>
                      <button
                        onClick={() => {
                          setShowFeedbackModal(cp);
                          setFeedbackStage(cp.current_interview_stage || "Screening");
                        }}
                        className="text-xs text-brand-orange hover:text-brand-orange/80 inline-flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        View
                      </button>
                    </div>
                  </div>
                ))}

                {(!candidatesByStatus[status.key] ||
                  candidatesByStatus[status.key].length === 0) && (
                  <div className="text-center py-8 text-white/30 text-xs">Drop here</div>
                )}
              </div>
            </div>
          </div>
        ))}
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
                  <option value="" className="bg-brand-black">
                    Select a candidate...
                  </option>
                  {availableCandidates.map((c) => (
                    <option key={c.id} value={c.id} className="bg-brand-black">
                      {c.first_name} {c.last_name} - {c.discipline}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowAddModal(false)} className="btn-ghost">
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
                <p className="text-white/60 mb-4">All candidates are already in this process.</p>
                <button onClick={() => setShowAddModal(false)} className="btn-secondary w-full">
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Feedback & Messages Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="card p-6 w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {showFeedbackModal.candidate?.first_name}{" "}
                  {showFeedbackModal.candidate?.last_name}
                </h3>
                <p className="text-sm text-white/60">
                  {showFeedbackModal.candidate?.discipline} •{" "}
                  {showFeedbackModal.status.charAt(0).toUpperCase() +
                    showFeedbackModal.status.slice(1)}
                  {showFeedbackModal.current_interview_stage &&
                    ` • ${showFeedbackModal.current_interview_stage} Interview`}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowFeedbackModal(null);
                  setFeedbackText("");
                  setSelectedFiles([]);
                  setReplyText("");
                  setReplyingToFeedback(null);
                }}
                className="text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation History */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {showFeedbackModal.feedback && showFeedbackModal.feedback.length > 0 ? (
                showFeedbackModal.feedback
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                  )
                  .map((fb) => (
                    <div key={fb.id} className="space-y-2">
                      {/* Original feedback */}
                      <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-brand-orange">
                            {fb.stage === "Screening" || fb.stage === "Offer"
                              ? fb.stage
                              : `${fb.stage} Interview`}
                          </span>
                          <span className="text-xs text-white/40">
                            {new Date(fb.created_at).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-white/80 whitespace-pre-wrap">
                          {fb.feedback_text}
                        </p>

                        {/* Attachments */}
                        {fb.attachments && fb.attachments.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs text-white/50">Attachments:</p>
                            {fb.attachments.map((att) => (
                              <button
                                key={att.id}
                                onClick={() => downloadFile(att)}
                                className="flex items-center gap-2 w-full p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-left"
                              >
                                <FileText className="w-4 h-4 text-brand-orange" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-white truncate">{att.file_name}</p>
                                  <p className="text-xs text-white/40">{formatFileSize(att.file_size)}</p>
                                </div>
                                <Download className="w-3 h-3 text-white/40" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Replies */}
                      {fb.replies && fb.replies.length > 0 && (
                        <div className="ml-4 space-y-2">
                          {fb.replies
                            .sort(
                              (a, b) =>
                                new Date(a.created_at).getTime() -
                                new Date(b.created_at).getTime()
                            )
                            .map((reply) => (
                              <div
                                key={reply.id}
                                className={`rounded-lg p-3 ${
                                  reply.is_from_admin
                                    ? "bg-white/5 border-l-2 border-brand-orange/50"
                                    : "bg-green-500/10 border-l-2 border-green-500/50"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-white/50">
                                    {reply.is_from_admin ? "You" : "Candidate"}
                                  </span>
                                  <span className="text-xs text-white/30">
                                    {new Date(reply.created_at).toLocaleDateString("en-GB", {
                                      day: "numeric",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                                <p className="text-sm text-white/70">{reply.message}</p>
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Reply input for this feedback */}
                      {replyingToFeedback === fb.id ? (
                        <div className="ml-4 space-y-2">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your reply..."
                            rows={2}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-orange/50 resize-none"
                            autoFocus
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setReplyingToFeedback(null);
                                setReplyText("");
                              }}
                              className="px-3 py-1.5 text-xs text-white/60 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => addReply(fb.id)}
                              disabled={!replyText.trim() || loading}
                              className="px-3 py-1.5 bg-brand-orange text-white text-xs rounded-lg hover:bg-brand-orange/90 disabled:opacity-50 inline-flex items-center gap-1"
                            >
                              {loading ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Send className="w-3 h-3" />
                              )}
                              Reply
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReplyingToFeedback(fb.id)}
                          className="ml-4 text-xs text-white/40 hover:text-white transition-colors"
                        >
                          Reply to this
                        </button>
                      )}
                    </div>
                  ))
              ) : (
                <p className="text-center text-white/40 py-8">No messages yet</p>
              )}
            </div>

            {/* Add New Feedback */}
            <div className="border-t border-white/10 pt-4">
              <p className="text-sm font-medium text-white mb-3">Add New Feedback</p>
              <div className="mb-3">
                <select
                  value={feedbackStage}
                  onChange={(e) => setFeedbackStage(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-brand-orange/50"
                >
                  <option value="Screening" className="bg-brand-black">
                    Screening
                  </option>
                  {INTERVIEW_STAGES.map((stage) => (
                    <option key={stage} value={stage} className="bg-brand-black">
                      {stage} Interview
                    </option>
                  ))}
                  <option value="Offer" className="bg-brand-black">
                    Offer
                  </option>
                </select>
              </div>

              <div className="mb-3">
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-orange/50 resize-none"
                  placeholder="Enter feedback, next steps, or propose interview times..."
                />
              </div>

              {/* File Attachments */}
              <div className="mb-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.zip,.png,.jpg,.jpeg"
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                  Attach Files
                </button>

                {/* Selected Files List */}
                {selectedFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-brand-orange flex-shrink-0" />
                          <span className="text-xs text-white truncate">{file.name}</span>
                          <span className="text-xs text-white/40 flex-shrink-0">
                            ({formatFileSize(file.size)})
                          </span>
                        </div>
                        <button
                          onClick={() => removeSelectedFile(index)}
                          className="text-white/40 hover:text-red-400 flex-shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowFeedbackModal(null);
                    setFeedbackText("");
                    setSelectedFiles([]);
                    setReplyText("");
                    setReplyingToFeedback(null);
                  }}
                  className="btn-ghost text-sm"
                >
                  Close
                </button>
                <button
                  onClick={addFeedback}
                  disabled={!feedbackText || loading}
                  className="btn-primary text-sm inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Send Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}