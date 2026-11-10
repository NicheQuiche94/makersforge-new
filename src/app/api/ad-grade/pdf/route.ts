import { createAdminClient } from "@/lib/supabase/admin";
import { gradePdfHtml } from "@/lib/adGradeReport";
import { htmlToPdf } from "@/lib/onboarding/pdf";
import type { Result } from "@/lib/adGrader";

/**
 * GET ?id= (Ashley's QA 2026-11-10): the full line-by-line report as a PDF
 * download, for the email's "Download the full report" button. The id is the
 * same unguessable one the analysis page uses.
 */
export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id") || "";
  if (!/^[a-f0-9]{10}$/.test(id)) return new Response("Not found", { status: 404 });
  const { data: row } = await createAdminClient().from("ad_grades").select("title, result").eq("id", id).maybeSingle();
  if (!row) return new Response("Not found", { status: 404 });
  const pdf = await htmlToPdf(gradePdfHtml(row.result as Result, row.title ?? undefined));
  const name = `Job ad analysis - ${(row.title || "your ad").replace(/[^\w ()-]+/g, "").slice(0, 60)}.pdf`;
  return new Response(new Uint8Array(pdf), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${name}"`, "Cache-Control": "private, max-age=3600" },
  });
}
