"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Plus, Trash2, Loader2 } from "lucide-react";

interface Tag {
  id: string;
  name: string;
  color: string;
  entity_type: string;
}

interface TagsManagerProps {
  tags: Tag[];
  entityType: "candidate" | "company";
}

const PRESET_COLORS = [
  "#EF4444", // Red
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#6B7280", // Gray
  "#E8491F", // Brand Orange
];

export function TagsManager({ tags, entityType }: TagsManagerProps) {
  const router = useRouter();
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(PRESET_COLORS[0]);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function addTag() {
    if (!newTagName.trim()) return;
    setAdding(true);

    await supabase.from("tags").insert({
      name: newTagName.trim(),
      color: newTagColor,
      entity_type: entityType,
    });

    setNewTagName("");
    setNewTagColor(PRESET_COLORS[0]);
    setAdding(false);
    router.refresh();
  }

  async function deleteTag(tagId: string) {
    setDeletingId(tagId);

    await supabase.from("tags").delete().eq("id", tagId);

    setDeletingId(null);
    router.refresh();
  }

  return (
    <div>
      {/* Existing Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5"
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: tag.color }}
            />
            <span className="text-white text-sm">{tag.name}</span>
            <button
              onClick={() => deleteTag(tag.id)}
              disabled={deletingId === tag.id}
              className="text-white/40 hover:text-red-400 transition-colors ml-1"
            >
              {deletingId === tag.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        ))}
        {tags.length === 0 && (
          <p className="text-white/40 text-sm">No tags yet. Add your first tag below.</p>
        )}
      </div>

      {/* Add New Tag */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="New tag name..."
          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
          onKeyDown={(e) => e.key === "Enter" && addTag()}
        />
        
        {/* Color Picker */}
        <div className="flex gap-1">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setNewTagColor(color)}
              className={`w-6 h-6 rounded-full transition-transform ${
                newTagColor === color ? "scale-125 ring-2 ring-white" : "hover:scale-110"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <button
          onClick={addTag}
          disabled={adding || !newTagName.trim()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange/90 disabled:opacity-50 transition-colors"
        >
          {adding ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Add
        </button>
      </div>
    </div>
  );
}