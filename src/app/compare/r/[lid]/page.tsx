import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { slotsLeft } from "@/lib/compareGifts";
import type { CompareInput, Priority } from "@/lib/compare";
import { isCurrency } from "@/lib/currency";
import { Results } from "../../result/Results";

export const metadata: Metadata = {
  title: "Your hiring plan · MakersForge",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

/* The comparison the email links to: /compare/r/<lid>, read from the saved request. */
export default async function ComparisonPage({ params }: { params: Promise<{ lid: string }> }) {
  const { lid } = await params;
  if (!/^[a-f0-9]{10}$/.test(lid)) return <Results input={null} />;
  const db = createAdminClient();
  const { data: row } = await db.from("compare_requests").select("lid, name, role, salary, currency, need_by, budget, priority, hook, christmas, answers").eq("lid", lid).maybeSingle();
  if (!row) return <Results input={null} />;
  const input: CompareInput = {
    lid: row.lid,
    role: row.role,
    salary: row.salary,
    start: row.need_by ?? undefined,
    budget: row.budget ?? undefined,
    p: row.priority as Priority,
    name: row.name ?? undefined,
    hook: row.hook,
    cur: isCurrency(row.currency) ? row.currency : "GBP",
    ...((row.answers ?? {}) as Pick<CompareInput, "level" | "history" | "runner" | "stakes" | "asked" | "process">),
  };
  // Saved answers use null for "not answered"; the plan reads undefined.
  for (const k of ["level", "history", "runner", "stakes", "asked", "process"] as const) if (input[k] === null) delete input[k];
  return <Results input={input} special={row.christmas} slots={row.christmas ? await slotsLeft(db) : 0} />;
}
