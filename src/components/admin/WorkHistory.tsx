import Link from "next/link";
import { Building2, Calendar } from "lucide-react";

interface WorkHistoryItem {
  id: string;
  job_title: string;
  is_current: boolean;
  start_date?: string;
  end_date?: string;
  company: {
    id: string;
    name: string;
    location?: string;
  };
}

interface WorkHistoryProps {
  history: WorkHistoryItem[];
}

export function WorkHistory({ history }: WorkHistoryProps) {
  if (history.length === 0) {
    return (
      <p className="text-white/40 text-sm text-center py-4">
        No work history added yet
      </p>
    );
  }

  function formatDate(dateStr?: string) {
    if (!dateStr) return "Present";
    return new Date(dateStr).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  }

  return (
    <div className="space-y-4">
      {history.map((item, index) => (
        <div
          key={item.id}
          className={`relative pl-8 pb-4 ${index < history.length - 1 ? "border-l border-white/10" : ""}`}
        >
          {/* Timeline dot */}
          <div className={`absolute left-0 top-0 w-4 h-4 rounded-full -translate-x-1/2 ${
            item.is_current ? "bg-green-500" : "bg-white/20"
          }`} />

          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white font-medium">{item.job_title || "Role not specified"}</p>
                <Link
                  href={`/admin/companies/${item.company.id}`}
                  className="text-brand-orange hover:underline text-sm inline-flex items-center gap-1 mt-1"
                >
                  <Building2 className="w-4 h-4" />
                  {item.company.name}
                </Link>
              </div>
              {item.is_current && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                  Current
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2 text-white/50 text-sm">
              <Calendar className="w-4 h-4" />
              {formatDate(item.start_date)} — {formatDate(item.end_date)}
            </div>
            {item.company.location && (
              <p className="text-white/40 text-sm mt-1">{item.company.location}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}