import { createAdminClient } from "@/lib/supabase/admin";
import { gradeEmail } from "@/lib/adGradeReport";
import type { Result } from "@/lib/adGrader";

/** Local-only: the grader email for a saved analysis (?id=, or the latest), for reviewing the layout. 404 in production. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (process.env.VERCEL_ENV === "production") return new Response("Not found", { status: 404 });
  const u = new URL(req.url);
  const id = u.searchParams.get("id");
  const q = createAdminClient().from("ad_grades").select("id, title, result");
  const { data: row } = id ? await q.eq("id", id).maybeSingle() : await q.order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (!row) return new Response("No analysis found", { status: 404 });
  const r = row.result as Result;
  const link = `${u.origin}/job-ad-grading-tool/r/${row.id}`;
  const html = gradeEmail(r, row.title ?? undefined, {
    online: link,
    rewrite: `${link}?rewrite=1`,
    pdf: `${u.origin}/api/ad-grade/pdf?id=${row.id}`,
    ring: `${u.origin}/api/ad-grade/ring?s=${r.score}&t=${r.band.tone}`,
  });
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
