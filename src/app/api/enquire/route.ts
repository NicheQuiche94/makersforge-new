import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "MakersForge Enquiries <andre@makersforge.gg>";
const ADMIN = "andre@makersforge.gg";

/**
 * /api/enquire — handler for the studio enquiry form.
 *
 * Required: firstName, lastName, companyName, companyEmail, titleOfHire, locationPref.
 * Optional: discipline, industry, gamesCat, appsCat, genre, monetisation,
 *           channels, budget, formats, expertise, dayRateBand, message, profile.
 *
 * `profile` is the codename of a lineup profile if the form was opened
 * from a "request info" CTA on that row. It pre-populates the email
 * subject so we know which specialist the studio asked about.
 */
export async function POST(request: Request) {
  try {
    const form = await request.formData();

    const firstName = (form.get("firstName") as string | null)?.trim();
    const lastName = (form.get("lastName") as string | null)?.trim();
    const companyName = (form.get("companyName") as string | null)?.trim();
    const companyEmail = (form.get("companyEmail") as string | null)?.trim();
    const titleOfHire = (form.get("titleOfHire") as string | null)?.trim();
    const locationPref = (form.get("locationPref") as string | null) || "";

    if (
      !firstName ||
      !lastName ||
      !companyName ||
      !companyEmail ||
      !titleOfHire ||
      !locationPref
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields (first name, last name, company, company email, title of hire, location preference).",
        },
        { status: 400 },
      );
    }

    const profile = (form.get("profile") as string | null)?.trim() || "—";
    const discipline = (form.get("discipline") as string | null) || "—";
    const industries = form.getAll("industries").join(", ") || "—";
    const gamesCat = form.getAll("gamesCat").join(", ") || "—";
    const appsCat = form.getAll("appsCat").join(", ") || "—";
    const genre = form.getAll("genre").join(", ") || "—";
    const monetisation = form.getAll("monetisation").join(", ") || "—";
    const channels = form.getAll("channels").join(", ") || "—";
    const budget = (form.get("budget") as string | null) || "—";
    const formats = form.getAll("formats").join(", ") || "—";
    const expertise = form.getAll("expertise").join(", ") || "—";
    const dayRateBand = (form.get("dayRateBand") as string | null) || "—";
    const timeline = (form.get("timeline") as string | null)?.trim() || "—";
    const message = ((form.get("message") as string | null) ?? "").trim() || "—";

    const fullName = `${firstName} ${lastName}`;

    const subjectTag =
      profile !== "—" ? `enquiry · ${profile}` : `enquiry · ${companyName}`;

    const html = renderEmail({
      firstName,
      lastName,
      fullName,
      companyName,
      companyEmail,
      titleOfHire,
      locationPref,
      profile,
      discipline,
      industries,
      gamesCat,
      appsCat,
      genre,
      monetisation,
      channels,
      budget,
      formats,
      expertise,
      dayRateBand,
      timeline,
      message,
    });

    const { error } = await resend.emails.send({
      from: FROM,
      to: ADMIN,
      subject: `📥 new ${subjectTag} · ${fullName} (${companyName})`,
      html,
      replyTo: companyEmail,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Email send failed." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Enquire route error:", err);
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
  firstName: string;
  lastName: string;
  fullName: string;
  companyName: string;
  companyEmail: string;
  titleOfHire: string;
  locationPref: string;
  profile: string;
  discipline: string;
  industries: string;
  gamesCat: string;
  appsCat: string;
  genre: string;
  monetisation: string;
  channels: string;
  budget: string;
  formats: string;
  expertise: string;
  dayRateBand: string;
  timeline: string;
  message: string;
}) {
  return `
<div style="font-family:'Figtree',-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;max-width:640px;margin:0 auto;background:#F5F1EA;padding:32px;">
  <div style="background:#fff;border-radius:18px;padding:36px;border:1px solid rgba(14,15,17,0.1);">
    <p style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#8A8780;font-weight:600;margin:0 0 6px;">New studio enquiry</p>
    <h1 style="font-family:'Cal Sans',sans-serif;font-weight:400;font-size:30px;letter-spacing:-0.025em;color:#0E0F11;margin:0 0 6px;text-transform:lowercase;">${escape(d.fullName)} . ${escape(d.companyName)}</h1>
    <p style="font-size:14px;color:#52525B;margin:0 0 24px;">looking for ${escape(d.titleOfHire)}${d.profile !== "—" ? " . re: " + escape(d.profile) : ""}</p>

    <table style="width:100%;border-collapse:collapse;border-top:1px solid rgba(14,15,17,0.1);margin-bottom:24px;">
      ${row("requester", `${d.fullName} <${d.companyEmail}>`)}
      ${row("company", d.companyName)}
      ${row("title of hire", d.titleOfHire)}
      ${row("location preference", d.locationPref)}
      ${row("timeline", d.timeline)}
      ${d.profile !== "—" ? row("profile asked about", d.profile) : ""}
      ${row("discipline", d.discipline)}
      ${row("industries", d.industries)}
      ${row("games category", d.gamesCat)}
      ${row("apps category", d.appsCat)}
      ${row("genre", d.genre)}
      ${row("monetisation", d.monetisation)}
      ${row("channels", d.channels)}
      ${row("budget", d.budget)}
      ${row("creative formats", d.formats)}
      ${row("expertise", d.expertise)}
      ${row("day rate band", d.dayRateBand)}
    </table>

    <p style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#8A8780;font-weight:600;margin:0 0 10px;">message</p>
    <p style="font-size:15px;line-height:1.6;color:#0E0F11;background:#FAF6EF;padding:18px;border-radius:12px;border:1px solid rgba(14,15,17,0.1);margin:0 0 24px;white-space:pre-wrap;">${escape(d.message)}</p>

    <p style="font-size:12px;color:#8A8780;margin:24px 0 0;">Reply directly to this email to reach ${escape(d.fullName)} at ${escape(d.companyName)}.</p>
  </div>
</div>
  `;
}
