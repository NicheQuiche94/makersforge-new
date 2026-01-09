"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { MessageSquare, Send, Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface Feedback {
  id: string;
  stage: string;
  feedback_text: string;
  is_from_candidate: boolean;
  created_at: string;
}

interface FeedbackSectionProps {
  candidateProcessId: string;
  feedback: Feedback[];
  candidateId: string;
}

export function FeedbackSection({ 
  candidateProcessId, 
  feedback, 
  candidateId 
}: FeedbackSectionProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const latestFeedback = feedback[0];
  const olderFeedback = feedback.slice(1);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || sending) return;

    setSending(true);

    try {
      await supabase.from("process_feedback").insert({
        candidate_process_id: candidateProcessId,
        feedback_text: message.trim(),
        is_from_candidate: true,
        stage: "candidate_message",
      });

      setMessage("");
      router.refresh();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="p-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left mb-4"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-medium text-sm">
            Feedback Received
          </span>
          {feedback.length > 0 && (
            <span className="text-white/40 text-xs">
              ({feedback.length} message{feedback.length !== 1 ? "s" : ""})
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-white/40" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/40" />
        )}
      </button>

      {expanded && (
        <div className="space-y-4">
          {/* Message Thread */}
          {feedback.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {/* Latest feedback highlighted */}
              {latestFeedback && (
                <div
                  className={`p-4 rounded-lg ${
                    latestFeedback.is_from_candidate
                      ? "bg-brand-orange/10 border border-brand-orange/20 ml-8"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  <p className="text-white/90 text-sm">
                    {latestFeedback.feedback_text}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-white/40 text-xs">
                      {latestFeedback.is_from_candidate ? "You" : "MakersForge"}
                    </span>
                    <span className="text-white/30 text-xs">
                      {new Date(latestFeedback.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Older messages */}
              {olderFeedback.map((fb) => (
                <div
                  key={fb.id}
                  className={`p-3 rounded-lg ${
                    fb.is_from_candidate
                      ? "bg-brand-orange/10 border border-brand-orange/20 ml-8"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  <p className="text-white/70 text-sm">{fb.feedback_text}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-white/40 text-xs">
                      {fb.is_from_candidate ? "You" : "MakersForge"}
                    </span>
                    <span className="text-white/30 text-xs">
                      {new Date(fb.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/40 text-sm text-center py-4">
              No messages yet. We'll update you on your progress here.
            </p>
          )}

          {/* Reply Form */}
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Send a message..."
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50 text-sm"
            />
            <button
              type="submit"
              disabled={!message.trim() || sending}
              className="px-4 py-3 bg-brand-orange text-white rounded-lg hover:bg-brand-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}