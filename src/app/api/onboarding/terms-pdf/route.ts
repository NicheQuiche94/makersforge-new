import { termsHtml } from "@/lib/onboarding/terms";
import { htmlToPdf } from "@/lib/onboarding/pdf";
import { priceDeal } from "@/lib/onboarding/pricing";
import type { Tier } from "@/lib/tier";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkCode } from "@/lib/compareGifts";
import type { PlanId } from "@/lib/plans";

/**
 * GET ?plan=batch&retained=1&roles=3&client=…&number=…&address=…
 * The full Terms of Business made out to them, before they sign (the
 * "Download your terms" link on the terms step). Unsigned; the signed copy
 * is emailed after they sign.
 */
export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const plan = (["permanent", "contract", "batch"].includes(q.get("plan") || "") ? q.get("plan") : "permanent") as PlanId;
  // A Christmas code (from /compare) is checked here too, so the preview shows the discounted fee.
  const gift = q.get("code") ? await checkCode(createAdminClient(), q.get("code")!) : null;
  const discount = gift?.ok ? { pct: gift.pct, code: gift.code } : undefined;
  // ?tiers=g,s,g: each role's tier for the preview (the booking itself re-derives them from the briefs).
  const tiers = (q.get("tiers") || "").split(",").map((t): Tier => (t === "e" ? "executive" : t === "s" ? "senior" : "team"));
  const deal = priceDeal(plan, q.get("retained") === "1", Number(q.get("roles")) || 1, discount?.pct, tiers);
  const client = (q.get("client") || "").slice(0, 200);
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const { html } = termsHtml(
    { variant: plan, retained: deal.retained, roles: deal.roles, tiers: deal.tiers, date, client, clientNumber: (q.get("number") || "").slice(0, 40), clientAddress: (q.get("address") || "").slice(0, 500), discount },
    { name: "(to be signed)", title: "", email: "", signedAt: "not yet signed", ip: "-", ref: "draft" },
  );
  // ?html=1 returns the same document as a web page (for checking the layout quickly).
  if (q.has("html")) return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  try {
    const pdf = await htmlToPdf(html);
    return new Response(new Uint8Array(pdf), {
      headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="MakersForge-Terms-${client.replace(/[^\w]+/g, "") || "draft"}.pdf"`, "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("terms preview pdf", err);
    // ?debug=1 shows the reason (no secrets in it), like the talent spec PDF.
    const why = q.has("debug") ? `: ${String(err)}` : "";
    return new Response(`PDF unavailable right now${why}`, { status: 500 });
  }
}
