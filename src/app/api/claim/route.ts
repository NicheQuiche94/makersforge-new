import { NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * /api/claim — an employer claims a sourced listing (Fair Board Standard).
 *
 * Manual on purpose, like /api/jobs-post: this emails Andre so a human verifies
 * the sender really is hiring for the role before it's marked verified. The
 * email includes a ready-to-paste claimed-roles.json snippet so promoting a
 * confirmed claim is a single paste. No DB, no auto-verify.
 */

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "MakersForge Board <andre@makersforge.gg>";
const ADMIN = "andre@makersforge.gg";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const get = (k: string) => (form.get(k) as string | null)?.trim() || "";

    const slug = get("slug");
    const company = get("company");
    const title = get("title");
    const contactName = get("contactName");
    const contactEmail = get("contactEmail");
    const notes = get("notes") || "—";

    if (!slug || !company || !title || !contactName || !contactEmail) {
      return NextResponse.json(
        { error: "Please fill in your name and work email." },
        { status: 400 },
      );
    }

    // Build the terms the employer confirmed, into the exact shape used by
    // claimed-roles.json — so the email carries a paste-ready snippet.
    const num = (k: string) => {
      const v = parseInt(get(k), 10);
      return Number.isFinite(v) ? v : undefined;
    };
    const terms: Record<string, unknown> = {};
    const payMin = num("payMin");
    const payMax = num("payMax");
    if (payMin != null || payMax != null) {
      terms.pay = {
        ...(payMin != null ? { min: payMin } : {}),
        ...(payMax != null ? { max: payMax } : {}),
        currency: get("currency") || "GBP",
        period: get("payPeriod") || "year",
      };
    }
    if (get("contract")) terms.contract = { type: get("contract") };
    const perWeek = num("hoursPerWeek");
    const secondJob = get("secondJob");
    if (perWeek != null || secondJob) {
      terms.hours = {
        ...(perWeek != null ? { per_week: perWeek } : {}),
        ...(secondJob === "allowed" ? { second_job_allowed: true } : {}),
        ...(secondJob === "exclusive" ? { second_job_allowed: false } : {}),
      };
    }
    if (get("remoteScope") || get("remoteWhere")) {
      terms.location = {
        mode: "remote",
        ...(get("remoteScope") ? { remote_scope: get("remoteScope") } : {}),
        ...(get("remoteWhere") ? { remote_where: get("remoteWhere") } : {}),
      };
    }

    const snippet = JSON.stringify({ [slug]: { terms } }, null, 2);

    const html = `
<div style="font-family:'Figtree',sans-serif;max-width:600px;margin:0 auto;background:#F5F1EA;padding:28px;">
  <div style="background:#fff;border-radius:16px;padding:32px;border:1px solid rgba(14,15,17,0.1);">
    <p style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#C72E00;font-weight:600;margin:0 0 8px;">Listing claim — verify sender</p>
    <h1 style="font-family:'Cal Sans',sans-serif;font-weight:400;font-size:26px;color:#0E0F11;margin:0 0 4px;">${escapeHtml(title)}</h1>
    <p style="font-size:15px;color:#52525B;margin:0 0 22px;">${escapeHtml(company)} · <code>${escapeHtml(slug)}</code></p>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid rgba(14,15,17,0.1);">
      ${row("claimed by", contactName)}
      ${row("work email", contactEmail)}
      ${row("pay", terms.pay ? JSON.stringify(terms.pay) : "—")}
      ${row("contract", get("contract") || "—")}
      ${row("weekly hours", get("hoursPerWeek") || "—")}
      ${row("second job", secondJob || "—")}
      ${row("remote scope", get("remoteScope") || get("remoteWhere") || "—")}
    </table>
    <p style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#8A8780;font-weight:600;margin:22px 0 8px;">notes</p>
    <p style="font-size:15px;line-height:1.6;color:#0E0F11;background:#FAF6EF;padding:16px;border-radius:12px;border:1px solid rgba(14,15,17,0.1);margin:0;white-space:pre-wrap;">${escapeHtml(notes)}</p>
    <p style="font-size:12px;color:#C72E00;font-weight:600;margin:22px 0 8px;">If the sender checks out, paste into src/data/claimed-roles.json:</p>
    <pre style="font-size:12px;line-height:1.5;color:#0E0F11;background:#0E0F11;color:#EDE7DC;padding:16px;border-radius:12px;margin:0;overflow-x:auto;white-space:pre-wrap;">${escapeHtml(snippet)}</pre>
    <p style="font-size:12px;color:#8A8780;margin:16px 0 0;">Reply to reach ${escapeHtml(contactEmail)}.</p>
  </div>
</div>`;

    const { error } = await resend.emails.send({
      from: FROM,
      to: ADMIN,
      subject: `✅ claim · ${title} (${company})`,
      replyTo: contactEmail,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Email send failed." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Claim route error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:8px 14px 8px 0;color:#8A8780;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;font-weight:600;vertical-align:top;width:130px;">${label}</td>
      <td style="padding:8px 0;color:#0E0F11;font-size:14px;line-height:1.5;">${escapeHtml(value)}</td>
    </tr>`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
