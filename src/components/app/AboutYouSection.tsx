"use client";

import { useState, useEffect } from "react";
import { X, Plus, Pencil } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useSearchParams, useRouter } from "next/navigation";

interface AboutYouSectionProps {
  clerkId: string;
  profile: {
    dream_role?: string;
    if_not_working?: string;
    weird_obsession?: string;
    personal_projects?: string;
    bio?: string;
  };
}

const questions = [
  {
    key: "dream_role",
    label: "Dream Role",
    question: "What's your dream role?",
    placeholder: "Describe your ideal position, company culture, or the kind of games you'd love to work on...",
  },
  {
    key: "if_not_working",
    label: "If Not in Games",
    question: "If you weren't working in games, what would you be doing?",
    placeholder: "Teaching? Running a bakery? Professional skydiver? Tell us...",
  },
  {
    key: "weird_obsession",
    label: "Weird Obsession",
    question: "What's something you're weirdly obsessed with?",
    placeholder: "Could be anything - a niche hobby, a specific game mechanic, collecting something unusual...",
  },
  {
    key: "personal_projects",
    label: "Personal Projects",
    question: "Any personal projects or side hustles?",
    placeholder: "Game jams, indie projects, a YouTube channel, anything you're working on outside of work...",
  },
];

export function AboutYouSection({ clerkId, profile }: AboutYouSectionProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  // Check for ?edit= query param on mount
  useEffect(() => {
    const editParam = searchParams.get("edit");
    if (editParam && questions.some((q) => q.key === editParam)) {
      openModal(editParam);
    }
  }, [searchParams]);

  const openModal = (key: string) => {
    setValue((profile as any)[key] || "");
    setEditingField(key);
  };

  const closeModal = () => {
    setEditingField(null);
    setValue("");
    // Clear the query param when closing
    router.replace("/profile", { scroll: false });
  };

  const handleSave = async () => {
    if (!editingField) return;
    setSaving(true);

    const { error } = await supabase
      .from("candidate_profiles")
      .update({ [editingField]: value })
      .eq("clerk_id", clerkId);

    if (!error) {
      window.location.href = "/profile";
    }
    setSaving(false);
    closeModal();
  };

  const currentQuestion = questions.find((q) => q.key === editingField);

  return (
    <>
      <div className="card p-8">
        <h2 className="text-xl font-bold text-white font-heading mb-6">
          About You
        </h2>
        <p className="text-white/50 text-sm mb-6">
          These help us understand you better and match you with the right opportunities.
        </p>
        <div className="space-y-4">
          {questions.map((q) => {
            const hasValue = !!(profile as any)[q.key];
            return (
              <button
                key={q.key}
                onClick={() => openModal(q.key)}
                className={`w-full text-left p-4 rounded-xl border transition-all group ${
                  hasValue
                    ? "bg-white/5 border-white/10 hover:border-white/20"
                    : "bg-brand-orange/5 border-brand-orange/20 border-dashed hover:border-brand-orange/40"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${hasValue ? "text-white" : "text-brand-orange"}`}>
                      {q.label}
                    </p>
                    {hasValue ? (
                      <p className="text-white/60 text-sm mt-1 line-clamp-2">
                        {(profile as any)[q.key]}
                      </p>
                    ) : (
                      <p className="text-white/40 text-sm mt-1">Click to add...</p>
                    )}
                  </div>
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {hasValue ? (
                      <Pencil className="w-4 h-4 text-white/40" />
                    ) : (
                      <Plus className="w-4 h-4 text-brand-orange" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {editingField && currentQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-brand-black-light border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-heading mb-2">
              {currentQuestion.question}
            </h3>
            <p className="text-white/50 text-sm mb-6">
              {currentQuestion.label}
            </p>

            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={currentQuestion.placeholder}
              rows={5}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50 resize-none"
              autoFocus
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-3 bg-brand-orange text-white rounded-xl hover:bg-brand-orange/90 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}