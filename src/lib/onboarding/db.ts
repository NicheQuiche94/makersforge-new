/**
 * Server-side data access for self-onboarding. Service role only (the tables
 * have RLS on with no policies), so callers must check who's signed in first.
 */
import { createAdminClient } from "@/lib/supabase/admin";

export type Week = { start: string; open: number };

/** Search weeks from next Monday on, with open slots (blocked weeks show 0). */
export async function availability(): Promise<Week[]> {
  const db = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await db.from("search_week_availability").select("week_start, open").gt("week_start", today).order("week_start").limit(26);
  if (error) throw error;
  return (data ?? []).map((w) => ({ start: w.week_start as string, open: w.open as number }));
}

/** One slot per role from the chosen week on (same rule as plans.ts scheduleRoles). */
export function schedule(weeks: Week[], start: string, roles: number): string[] | null {
  const out: string[] = [];
  for (const w of weeks) {
    if (w.start < start) continue;
    for (let i = 0; i < w.open && out.length < roles; i++) out.push(w.start);
    if (out.length >= roles) return out;
  }
  return null;
}
