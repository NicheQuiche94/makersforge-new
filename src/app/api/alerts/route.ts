import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

/**
 * /api/alerts — job-alert signup capture.
 *
 * The segmented category list is the asset (brief §4), so this does two
 * things, independently:
 *   1. Persists {email, categories, source} to a Supabase `job_alerts`
 *      table — the durable, exportable list.
 *   2. Emails Andre the signup so no lead is lost even before the table
 *      exists / if Supabase is unconfigured.
 *
 * A signup succeeds if EITHER path lands. It only 500s if both fail, so a
 * missing Supabase table never blocks capture. Supabase table SQL is in the
 * README ("Managing the board").
 */

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "MakersForge Board <andre@makersforge.gg>";
const ADMIN = "andre@makersforge.gg";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const email = (form.get("email") as string | null)?.trim().toLowerCase();
    const categories = form.getAll("categories").map(String);
    const source = (form.get("source") as string | null)?.trim() || "unknown";
    // "candidate" (default) = job-seeker wants role alerts.
    // "talent" = hiring team wants to be told when matching talent joins.
    const type = (form.get("type") as string | null)?.trim() || "candidate";
    const notes = (form.get("notes") as string | null)?.trim() || "";
    const isTalent = type === "talent";

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 },
      );
    }

    let stored = false;
    let notified = false;

    // 1. Best-effort persistence — never throws out of the handler.
    stored = await storeSignup(email, categories, source);

    // 2. Notify Andre.
    try {
      const catLabel = categories.length
        ? categories.join(", ")
        : isTalent
          ? "any"
          : "all";
      const heading = isTalent
        ? "New talent alert (hiring team)"
        : "New job-alert signup";
      const rolesLabel = isTalent ? "Wants to hire" : "Categories";
      const notesRow = notes
        ? `<p style="font-size:14px;color:#52525B;margin:0 0 4px;"><strong>Looking for:</strong> ${escapeHtml(notes)}</p>`
        : "";
      const { error } = await resend.emails.send({
        from: FROM,
        to: ADMIN,
        subject: isTalent
          ? `🎯 new talent alert · ${email}`
          : `🔔 new job alert signup · ${email}`,
        replyTo: email,
        html: `
<div style="font-family:'Figtree',sans-serif;max-width:560px;margin:0 auto;background:#F5F1EA;padding:28px;">
  <div style="background:#fff;border-radius:16px;padding:28px;border:1px solid rgba(14,15,17,0.1);">
    <p style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8A8780;font-weight:600;margin:0 0 8px;">${heading}</p>
    <h1 style="font-family:'Cal Sans',sans-serif;font-weight:400;font-size:24px;color:#0E0F11;margin:0 0 14px;">${escapeHtml(email)}</h1>
    <p style="font-size:14px;color:#52525B;margin:0 0 4px;"><strong>${rolesLabel}:</strong> ${escapeHtml(catLabel)}</p>
    ${notesRow}
    <p style="font-size:14px;color:#52525B;margin:0;"><strong>Source:</strong> ${escapeHtml(source)}</p>
    <p style="font-size:12px;color:#8A8780;margin:18px 0 0;">Stored in Supabase: ${stored ? "yes" : "no (table not configured — this email is the record)"}</p>
  </div>
</div>`,
      });
      notified = !error;
    } catch (err) {
      console.error("Alert notify error:", err);
    }

    if (!stored && !notified) {
      return NextResponse.json(
        { error: "Could not record signup. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Alerts route error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

/** Insert into Supabase if configured. Returns false on any problem. */
async function storeSignup(
  email: string,
  categories: string[],
  source: string,
): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Prefer the service-role key server-side; fall back to anon if that's all
  // that's set (works if the table has an insert policy for anon).
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;

  try {
    const supabase = createClient(url, key);
    const { error } = await supabase
      .from("job_alerts")
      .insert({ email, categories, source });
    if (error) {
      console.error("Supabase insert error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Supabase insert exception:", err);
    return false;
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
