import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "MakersForge Roster <andre@makersforge.gg>";
const ADMIN = "andre@makersforge.gg";

// Max CV size: 5MB. Resend allows attachments up to ~10MB but we keep
// a safer ceiling here to fail fast on accidental video uploads etc.
const MAX_CV_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    // Required fields validation
    const name = (form.get("name") as string | null)?.trim();
    const email = (form.get("email") as string | null)?.trim();
    const discipline = form.get("discipline") as string | null;
    const role = (form.get("role") as string | null)?.trim();
    const background = (form.get("background") as string | null)?.trim();

    if (!name || !email || !discipline || !role || !background) {
      return NextResponse.json(
        { error: "Missing required fields (name, email, discipline, role, background)." },
        { status: 400 },
      );
    }

    // Collect everything else
    const phone = (form.get("phone") as string | null)?.trim() || "—";
    const linkedin = (form.get("linkedin") as string | null)?.trim() || "—";
    const location = (form.get("location") as string | null)?.trim() || "—";
    const industries = form.getAll("industries").join(", ") || "—";
    const gamesCat = form.getAll("gamesCat").join(", ") || "—";
    const appsCat = form.getAll("appsCat").join(", ") || "—";
    const genre = form.getAll("genre").join(", ") || "—";
    const monetisation = form.getAll("monetisation").join(", ") || "—";
    const channels = form.getAll("channels").join(", ") || "—";
    const budget = (form.get("budget") as string | null) || "—";
    const formats = form.getAll("formats").join(", ") || "—";
    const expertise = form.getAll("expertise").join(", ") || "—";
    const dayRate = (form.get("dayRate") as string | null)?.trim() || "—";
    const rateMin = (form.get("rateMin") as string | null)?.trim() || "—";
    const available = form.get("available") === "on" ? "yes" : "no";
    const summary = ((form.get("summary") as string | null) ?? "").trim() || "—";

    // CV file
    const cv = form.get("cv") as File | null;
    let cvAttachment: { filename: string; content: Buffer } | null = null;
    if (cv && cv.size > 0) {
      if (cv.size > MAX_CV_BYTES) {
        return NextResponse.json(
          { error: `CV must be smaller than ${MAX_CV_BYTES / 1024 / 1024}MB.` },
          { status: 400 },
        );
      }
      const buf = Buffer.from(await cv.arrayBuffer());
      cvAttachment = {
        filename: cv.name || "cv",
        content: buf,
      };
    }

    const html = renderEmail({
      name,
      email,
      phone,
      linkedin,
      discipline,
      role,
      background,
      location,
      industries,
      gamesCat,
      appsCat,
      genre,
      monetisation,
      channels,
      budget,
      formats,
      expertise,
      dayRate,
      rateMin,
      available,
      summary,
      hasCv: !!cvAttachment,
    });

    const { error } = await resend.emails.send({
      from: FROM,
      to: ADMIN,
      subject: `🟧 new roster applicant · ${name} (${discipline.toUpperCase()})`,
      html,
      replyTo: email,
      attachments: cvAttachment ? [cvAttachment] : undefined,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Email send failed." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Apply route error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:8px 14px 8px 0;color:#8A8780;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;font-weight:600;vertical-align:top;width:200px;">${label}</td>
      <td style="padding:8px 0;color:#0E0F11;font-size:14px;line-height:1.5;">${escape(value)}</td>
    </tr>
  `;
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderEmail(d: {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  discipline: string;
  role: string;
  background: string;
  location: string;
  industries: string;
  gamesCat: string;
  appsCat: string;
  genre: string;
  monetisation: string;
  channels: string;
  budget: string;
  formats: string;
  expertise: string;
  dayRate: string;
  rateMin: string;
  available: string;
  summary: string;
  hasCv: boolean;
}) {
  return `
<div style="font-family:'Figtree',-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;max-width:640px;margin:0 auto;background:#F5F1EA;padding:32px;">
  <div style="background:#fff;border-radius:18px;padding:36px;border:1px solid rgba(14,15,17,0.1);">
    <p style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#8A8780;font-weight:600;margin:0 0 6px;">New roster applicant</p>
    <h1 style="font-family:'Cal Sans',sans-serif;font-weight:400;font-size:34px;letter-spacing:-0.025em;color:#0E0F11;margin:0 0 6px;text-transform:lowercase;">${escape(d.name)}</h1>
    <p style="font-size:14px;color:#52525B;margin:0 0 24px;">${escape(d.role)} · ${escape(d.background)}${d.location !== "—" ? " · " + escape(d.location) : ""}</p>

    <table style="width:100%;border-collapse:collapse;border-top:1px solid rgba(14,15,17,0.1);margin-bottom:24px;">
      ${row("contact", `${d.email} · ${d.phone}`)}
      ${row("linkedin", d.linkedin)}
      ${row("discipline", d.discipline)}
      ${row("available", d.available)}
      ${row("day rate", d.dayRate)}
      ${row("day rate min (sort)", d.rateMin)}
      ${row("industries", d.industries)}
      ${row("games category", d.gamesCat)}
      ${row("apps category", d.appsCat)}
      ${row("genre", d.genre)}
      ${d.discipline === "ua" ? row("monetisation", d.monetisation) : ""}
      ${d.discipline === "ua" ? row("channels", d.channels) : ""}
      ${d.discipline === "ua" ? row("budget managed", d.budget) : ""}
      ${d.discipline === "creative" ? row("creative formats", d.formats) : ""}
      ${row("expertise", d.expertise)}
      ${row("cv attached", d.hasCv ? "yes (see attachment)" : "no")}
    </table>

    <p style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#8A8780;font-weight:600;margin:0 0 10px;">summary</p>
    <p style="font-size:15px;line-height:1.6;color:#0E0F11;background:#FAF6EF;padding:18px;border-radius:12px;border:1px solid rgba(14,15,17,0.1);margin:0 0 24px;">${escape(d.summary)}</p>

    <p style="font-size:12px;color:#8A8780;margin:24px 0 0;">Reply directly to this email to reach ${escape(d.name)}.</p>
  </div>
</div>
  `;
}
