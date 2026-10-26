import { NextResponse } from "next/server";
import { Resend } from "resend";

const FROM = "MakersForge Briefs <andre@makersforge.gg>";
const ADMIN = "andre@makersforge.gg";

// Vercel caps request bodies at ~4.5MB, so keep files comfortably under.
const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = /\.(pdf|docx?|txt|rtf|odt|pages)$/i;

/**
 * /api/brief — the free-candidates form (2026-10-27). Deliberately loose:
 * a name and work email, then EITHER free text about the role OR a job
 * spec file (or both). Emails Andre with the file attached.
 */
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const name = (form.get("name") as string | null)?.trim() || "";
    const email = (form.get("email") as string | null)?.trim() || "";
    const details = (form.get("details") as string | null)?.trim() || "";
    const industry = (form.get("industry") as string | null)?.trim() || "";
    // Set when a studio asks to interview a Talent Directory profile.
    const profile = (form.get("profile") as string | null)?.trim() || "";
    const file = form.get("spec");
    const spec = file instanceof File && file.size > 0 ? file : null;

    if (!name || !email) {
      return NextResponse.json({ error: "Add your name and work email." }, { status: 400 });
    }
    if (!profile && !details && !spec) {
      return NextResponse.json(
        { error: "Tell us a little about the role, or attach a job spec." },
        { status: 400 },
      );
    }
    if (spec && (spec.size > MAX_BYTES || !ALLOWED.test(spec.name))) {
      return NextResponse.json(
        { error: "Job specs need to be a PDF or Word file under 4MB. You can paste it into the box instead." },
        { status: 400 },
      );
    }

    const company = email.split("@")[1] || "—";
    const attachments = spec
      ? [{ filename: spec.name, content: Buffer.from(await spec.arrayBuffer()) }]
      : undefined;

    // Created here, not at module load, so validation works without a key locally.
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: FROM,
      to: ADMIN,
      replyTo: email,
      subject: profile
        ? `🙋 interview request · ${profile} · ${name} (${company})`
        : `🎁 free candidates request · ${name} (${company})`,
      html: `
        <div style="font-family:system-ui,sans-serif;color:#0E0F11;font-size:14px;line-height:1.55">
          <p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#E14B00;font-weight:700;margin:0 0 12px">${profile ? `Interview request for ${escape(profile)}` : "Free candidates request"}</p>
          <p style="margin:0 0 4px"><strong>${escape(name)}</strong> · ${escape(email)}</p>
          ${industry ? `<p style="margin:0 0 4px;color:#555">From the ${escape(industry)} page</p>` : ""}
          <p style="margin:12px 0 4px;color:#555">${spec ? `Job spec attached: ${escape(spec.name)}` : "No job spec attached"}</p>
          <div style="margin-top:16px;padding:14px 16px;background:#F5F1EA;border-radius:10px;white-space:pre-wrap">${details ? escape(details) : "<em>No details typed.</em>"}</div>
          <p style="margin-top:16px;color:#555">Reply to this email to answer them directly.</p>
        </div>`,
      attachments,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Email send failed." }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Brief route error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
