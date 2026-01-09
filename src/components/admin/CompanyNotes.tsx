"use client";

import { formatDistanceToNow } from "date-fns";
import { MessageSquare } from "lucide-react";

interface Note {
  id: string;
  content: string;
  created_at: string;
  created_by?: string;
}

interface CompanyNotesProps {
  notes: Note[];
}

export function CompanyNotes({ notes }: CompanyNotesProps) {
  if (!notes || notes.length === 0) {
    return (
      <div className="text-center py-8 text-white/40">
        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No notes yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {notes.map((note) => (
        <div
          key={note.id}
          className="p-4 bg-white/5 rounded-lg border border-white/10"
        >
          <p className="text-white whitespace-pre-wrap">{note.content}</p>
          <div className="flex items-center gap-2 mt-3 text-white/40 text-xs">
            <span>
              {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
            </span>
            {note.created_by && (
              <>
                <span>·</span>
                <span>{note.created_by}</span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}