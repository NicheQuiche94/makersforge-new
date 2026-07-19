import { NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * /api/jobs-post — employer role submission (brief §4).
 *
 * v1 is deliberately manual: this emails Andre so every submission becomes a
 * sales conversation. No backend, no DB, no auto-publish — Andre reviews and
 * adds the role to jobs.json by hand.
 */

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "MakersForge Board <andre@makersforge.gg>";
const ADMIN = "andre@makersforge.gg";

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    const company = (form.get("company") as string | null)?.trim();
    const companyUrl = (form.get("companyUrl") as string | null)?.trim();
    const title = (form.get("title") as string | null)?.trim();
    const category = (form.get("category") as string | null)?.trim();
    const location = (form.get("location") as string | null)?.trim();
    const remote = (form.get("remote") as string | null)?.trim();
    const applyUrl = (form.get("applyUrl") as string | null)?.trim();
    const contactEmail = (form.get("contactEmail") as string | null)?.trim();
    const notes = ((form.get("notes") as string | null) ?? "").trim() || "—";

    if (
      !company ||
      !companyUrl ||
      !title ||
      !category ||
      !location ||
      !remote ||
      !applyUrl ||
      !contactEmail
    ) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 },
      );
    }

    const html = `
<div style="font-family:'Figtree',sans-serif;max-width:600px;margin:0 auto;background:#F5F1EA;padding:28px;">
  <div style="background:#fff;border-radius:16px;padding:32px;border:1px solid rgba(14,15,17,0.1);">
    <p style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8A8780;font-weight:600;margin:0 0 8px;">New job submission</p>
    <h1 style="font-family:'Cal Sans',sans-serif;font-weight:400;font-size:26px;color:#0E0F11;margin:0 0 4px;">${escapeHtml(title)}</h1>
    <p style="font-size:15px;color:#52525B;margin:0 0 22px;">${escapeHtml(company)}</p>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid rgba(14,15,17,0.1);">
      ${row("company", `${company} — ${companyUrl}`)}
      ${row("category", category)}
      ${row("location", location)}
      ${row("work mode", remote)}
      ${row("apply url", applyUrl)}
      ${row("contact", contactEmail)}
    </table>
    <p style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#8A8780;font-weight:600;margin:22px 0 8px;">notes</p>
    <p style="font-size:15px;line-height:1.6;color:#0E0F11;background:#FAF6EF;padding:16px;border-radius:12px;border:1px solid rgba(14,15,17,0.1);margin:0;white-space:pre-wrap;">${escapeHtml(notes)}</p>
    <p style="font-size:12px;color:#8A8780;margin:22px 0 0;">Reply to reach ${escapeHtml(contactEmail)}. If in remit, add to jobs.json.</p>
  </div>
</div>`;

    const { error } = await resend.emails.send({
      from: FROM,
      to: ADMIN,
      subject: `🧩 job submission · ${title} (${company})`,
      replyTo: contactEmail,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Email send failed." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Jobs-post route error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:8px 14px 8px 0;color:#8A8780;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;font-weight:600;vertical-align:top;width:150px;">${label}</td>
      <td style="padding:8px 0;color:#0E0F11;font-size:14px;line-height:1.5;">${escapeHtml(value)}</td>
    </tr>`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
