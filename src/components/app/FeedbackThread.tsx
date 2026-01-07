"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface Reply {
  id: string;
  message: string;
  is_from_admin: boolean;
  created_at: string;
}

interface Feedback {
  id: string;
  stage: string;
  feedback_text: string;
  created_at: string;
  replies?: Reply[];
}

interface Props {
  feedback: Feedback[];
  candidateProcessId: string;
  candidateName: string;
  candidateEmail: string;
  roleTitle: string;
  companyName: string;
}

export function FeedbackThread({ 
  feedback, 
  candidateProcessId,
  candidateName,
  candidateEmail,
  roleTitle,
  companyName,
}: Props) {
  const router = useRouter();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  function formatStageLabel(stage: string) {
    if (stage === "Screening" || stage === "Offer") return stage;
    return `${stage} Interview`;
  }

  async function sendReply(feedbackId: string, stage: string) {
    if (!replyText.trim()) return;
    setLoading(true);

    const { error } = await supabase.from("feedback_replies").insert([
      {
        feedback_id: feedbackId,
        message: replyText.trim(),
        is_from_admin: false,
      },
    ]);

    if (!error) {
      // Notify admin of the reply
      try {
        await fetch("/api/notifications/reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            candidateName,
            candidateEmail,
            roleTitle,
            companyName,
            stage,
            replyPreview: replyText.trim(),
          }),
        });
      } catch (e) {
        console.error("Failed to send admin notification:", e);
      }

      setReplyText("");
      setReplyingTo(null);
      router.refresh();
    }

    setLoading(false);
  }

  if (!feedback || feedback.length === 0) {
    return (
      <div className="border-t border-white/10 pt-4 mt-4">
        <p className="text-sm text-white/40 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Feedback will appear here after each stage
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-white/10 pt-4 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-4 h-4 text-brand-orange" />
        <h4 className="text-sm font-semibold text-white">Feedback & Messages</h4>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-white/10" />

        <div className="space-y-4">
          {feedback
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((fb, index) => (
              <div key={fb.id} className="relative pl-6">
                {/* Timeline dot */}
                <div
                  className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 ${
                    index === 0
                      ? "bg-brand-orange border-brand-orange"
                      : "bg-brand-black border-white/30"
                  }`}
                />

                <div className="space-y-2">
                  {/* Original feedback */}
                  <div
                    className={`rounded-lg p-4 ${
                      index === 0
                        ? "bg-brand-orange/10 border border-brand-orange/20"
                        : "bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            index === 0
                              ? "bg-brand-orange/20 text-brand-orange"
                              : "bg-white/10 text-white/60"
                          }`}
                        >
                          {formatStageLabel(fb.stage)}
                        </span>
                        <span className="text-xs text-white/40">MakersForge</span>
                      </div>
                      <span className="text-xs text-white/40">
                        {new Date(fb.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                      {fb.feedback_text}
                    </p>
                  </div>

                  {/* Replies */}
                  {fb.replies && fb.replies.length > 0 && (
                    <div className="space-y-2 ml-4">
                      {fb.replies
                        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
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
                                {reply.is_from_admin ? "MakersForge" : "You"}
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

                  {/* Reply input */}
                  {replyingTo === fb.id ? (
                    <div className="ml-4 space-y-2">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply..."
                        rows={3}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-orange/50 resize-none"
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText("");
                          }}
                          className="px-3 py-1.5 text-sm text-white/60 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => sendReply(fb.id, fb.stage)}
                          disabled={!replyText.trim() || loading}
                          className="px-3 py-1.5 bg-brand-orange text-white text-sm rounded-lg hover:bg-brand-orange/90 transition-colors disabled:opacity-50 inline-flex items-center gap-1"
                        >
                          {loading ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Send className="w-3 h-3" />
                          )}
                          Send
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyingTo(fb.id)}
                      className="ml-4 text-xs text-brand-orange hover:text-brand-orange/80 transition-colors"
                    >
                      Reply to this feedback
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}