/**
 * Client emails for self-onboarding (PROTOTYPE 2026-11-02). Every email the
 * booking flow, the admin and the portal send, as { to, subject, html }.
 * Nothing sends yet: /emails-preview renders them for Andre to sign off the
 * wording and look first. Plain inline-styled HTML (what email clients
 * render), same shape as the site's other emails (see lib/email.ts).
 */

export type EmailData = {
  company: string;
  legal: string;
  number: string;
  address: string;
  vat?: string;
  po?: string;
  contact: string;
  first: string;
  email: string;
  accounts: string;
  plan: string; // "Batch of 3 roles · retained"
  roles: string[];
  week: string; // "9 to 13 Nov"
  weekStart: string; // "Mon 9 Nov"
  shortlist: string; // "Mon 16 Nov"
  retainer?: string; // "£9,400"
  signedBy: string; // "Sam Patel, Head of Growth"
  signedAt: string; // "2 Nov 2026, 10:42"
  ukClient: boolean;
  /** Hire invoice email: which hire and what to bill (the preview shows an example). */
  hire?: { role: string; nth: number; fee: string; credit?: string; amount: string; note?: string };
  /** Shortlist emails: which role, and the client's Airtable tracker. */
  shortlistRole?: string;
  tracker?: string;
  /** Sign-in email only: the one-time code and the magic link. */
  code?: string;
  link?: string;
  /** One row per role: [role, search week, shortlist date]. */
  schedule?: [string, string, string][];
};

export type Email = { id: string; label: string; to: string; subject: string; html: string };

const SITE = "https://www.makersforge.gg";
const INK = "#16181d";
const DIM = "#5b5f69";
const HAIR = "#e7e1d8";
const ORANGE = "#ff5d00";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** The shared frame: dark band with the mark, a white card, the company footer. */
export function layout(body: string, preheader: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only"><style>:root{color-scheme:light only;supported-color-schemes:light only}</style></head>
<body style="margin:0;padding:0;background:#f4efe8;font-family:Helvetica,Arial,sans-serif;color:${INK}">
<span style="display:none;max-height:0;overflow:hidden">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4efe8"><tr><td align="center" style="padding:28px 14px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td style="background:${INK};border-radius:16px 16px 0 0;padding:18px 28px">
<img src="${SITE}/images/mf-icon-white.png" width="146" height="36" alt="MakersForge" style="display:block;border:0">
</td></tr>
<tr><td style="background:#fff;border-radius:0 0 16px 16px;padding:30px 28px 28px;font-size:15.5px;line-height:1.6">${body}</td></tr>
<tr><td style="padding:18px 6px;font-size:12px;line-height:1.5;color:#8a8e97;text-align:center">
MakersForge Ltd · Second Floor, 2 The Waterhouse, Waterhouse Street, Hemel Hempstead HP1 1ES<br>
<a href="${SITE}" style="color:#8a8e97">makersforge.gg</a> · <a href="${SITE}/account" style="color:#8a8e97">Your client portal</a>
</td></tr>
</table></td></tr></table></body></html>`;
}

const h1 = (t: string) => `<h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;color:${INK}">${t}</h1>`;
const p = (t: string) => `<p style="margin:0 0 14px">${t}</p>`;
const button = (label: string, href: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 20px"><tr><td bgcolor="${ORANGE}" style="border-radius:999px">
<a href="${href}" style="display:inline-block;padding:13px 24px;font-weight:700;font-size:15px;color:#fff;text-decoration:none;border-radius:999px">${label} →</a>
</td></tr></table>`;
/** Label / value rows, like the booking panel. */
const rows = (items: [string, string][]) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 20px;border-top:1px solid ${HAIR}">${items
    .map(
      ([k, v]) =>
        `<tr><td style="padding:10px 0;border-bottom:1px solid ${HAIR};color:${DIM};font-size:14px;width:38%;vertical-align:top">${k}</td><td style="padding:10px 0;border-bottom:1px solid ${HAIR};font-size:14.5px">${v}</td></tr>`,
    )
    .join("")}</table>`;
const steps = (items: string[]) =>
  `<ol style="margin:0 0 18px;padding-left:20px">${items.map((s) => `<li style="margin:0 0 6px">${s}</li>`).join("")}</ol>`;
const signoff = p(`Andre<br><span style="color:${DIM};font-size:14px">Founder, MakersForge</span>`);

const ORD = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

export function clientEmails(d: EmailData): Email[] {
  const hire = d.hire ?? { role: d.roles[1] ?? d.roles[0], nth: 2, fee: "£9,350", note: "2nd hire, 15% retained discount", credit: "−£4,000", amount: "£5,350" };
  const nth = ORD[hire.nth - 1] ?? `#${hire.nth}`;
  const tracker = d.tracker || "https://airtable.com";
  const slRole = d.shortlistRole ?? d.roles[1] ?? d.roles[0];
  const roles = d.roles.length > 1 ? `${d.roles.length} roles: ${d.roles.join(", ")}` : d.roles[0];
  const vatLine = d.ukClient ? "UK client, so VAT applies (included in the fee)" : "Client outside the UK: no VAT unless the candidate is UK-based";
  return [
    {
      id: "signin",
      label: "1 · Sign-in code",
      to: d.email,
      subject: `${d.code ?? "123456"} is your MakersForge code`,
      html: layout(
        h1(`Hi ${d.first}, here's your code`) +
          p("Type this into the booking page to carry on. It works once and expires in an hour.") +
          `<p style="margin:6px 0 20px;font-size:32px;font-weight:700;letter-spacing:0.18em;color:${INK}">${d.code ?? "123456"}</p>` +
          p(`<span style="color:${DIM};font-size:14px">Or sign straight in with this link instead:</span>`) +
          button("Sign in", d.link ?? `${SITE}/account`) +
          p(`<span style="color:${DIM};font-size:14px">Didn't ask for this? You can ignore it, nothing happens without the code.</span>`),
        "Your sign-in code",
      ),
    },
    {
      id: "booked",
      label: "2 · Booking confirmed",
      to: d.email,
      subject: `You're booked in: search week ${d.week}`,
      html: layout(
        h1("You're booked in") +
          p(`Thanks ${d.first}. Your search week is held and your signed terms are attached to the next email.`) +
          rows([
            ...(d.schedule && d.schedule.length > 1
              ? ([["Search weeks", d.schedule.map(([r, w, sl]) => `${r}: ${w}, shortlist ${sl}`).join("<br>")]] as [string, string][])
              : ([
                  ["Search week", d.week],
                  ["Shortlist", `5 candidates by ${d.shortlist}`],
                  ["Role", roles],
                ] as [string, string][])),
            ["Plan", d.plan],
          ]) +
          p("<strong>What happens next</strong>") +
          steps([
            "I read your brief and confirm it, usually within a working day.",
            ...(d.retainer ? [`Your retainer invoice (${d.retainer}) comes from our accounts team. Paying it before ${d.weekStart} keeps your week.`] : []),
            "When your first candidates are ready, I invite you to your private candidate tracker.",
            d.schedule && d.schedule.length > 1
              ? "Each role gets its own search week, and its 5 candidates land the Monday after. Then I book the interviews and run the process with you."
              : `We search all week, and your 5 land on ${d.shortlist}. Then I book the interviews and run the process with you.`,
          ]) +
          button("Go to your portal", `${SITE}/account`) +
          signoff,
        `Search week ${d.week}, shortlist by ${d.shortlist}`,
      ),
    },
    {
      id: "terms",
      label: "3 · Signed terms (PDF attached)",
      to: `${d.email}, cc andre@makersforge.gg`,
      subject: `Your signed terms with MakersForge`,
      html: layout(
        h1("Your signed terms") +
          p(`Here's a copy of the Terms of Business between MakersForge Ltd and ${esc(d.legal)}, signed by both of us. Keep it for your records.`) +
          rows([
            ["Signed for you", `${d.signedBy}, ${d.signedAt}`],
            ["Signed for us", "Andre Lemaitre, Founder"],
            ["Attached", `MakersForge-Terms-${d.company.replace(/\s+/g, "")}.pdf`],
          ]) +
          p("You'll also find it in your portal under Account.") +
          signoff,
        "A copy of your Terms of Business",
      ),
    },
    {
      id: "invoice-retainer",
      label: "4 · Invoice to raise: retainer (to you)",
      to: "andre@makersforge.gg",
      subject: `Invoice to raise: ${d.legal}, retainer ${d.retainer}`,
      html: layout(
        h1("Invoice to raise") +
          p(`New retained booking. The retainer is due before their search week starts on <strong>${d.weekStart}</strong>.`) +
          rows([
            ["Amount", `<strong>${d.retainer}</strong>`],
            ["For", `Retainer, ${d.plan.toLowerCase()} (credited against their first hires)`],
            ["Bill to", `${esc(d.legal)}<br>Company no. ${d.number}<br>${esc(d.address)}`],
            ["Send to", d.accounts],
            ["VAT", d.vat ? `${vatLine} · their VAT no. ${d.vat}` : vatLine],
            ...(d.po ? ([["PO number", d.po]] as [string, string][]) : []),
            ["Payment", `Bank transfer, due by ${d.weekStart}`],
          ]) +
          p(`<span style="color:${DIM};font-size:14px">Sent automatically when ${esc(d.company)} signed. Everything needed for the invoice is above.</span>`),
        `Retainer ${d.retainer} for ${d.legal}`,
      ),
    },
    {
      id: "invoice-hire",
      label: "5 · Invoice to raise: a hire (to you)",
      to: "andre@makersforge.gg",
      subject: `Invoice to raise: ${d.legal}, ${nth} hire (${hire.amount})`,
      html: layout(
        h1("Invoice to raise") +
          p(`${esc(d.company)} have made their ${nth} hire.`) +
          rows([
            ["Hire", `${esc(hire.role)} (${nth} hire)`],
            ["Fee", `${hire.fee}${hire.note ? ` (${hire.note})` : ""}`],
            ...(hire.credit ? ([["Less retainer credit", hire.credit]] as [string, string][]) : []),
            ["Amount", `<strong>${hire.amount}</strong>`],
            ["Bill to", `${esc(d.legal)}<br>Company no. ${d.number}<br>${esc(d.address)}`],
            ["Send to", d.accounts],
            ["VAT", vatLine],
            ["Payment", "14 days, bank transfer"],
          ]) +
          p(`<span style="color:${DIM};font-size:14px">Sent automatically when you marked the hire in your admin.</span>`),
        "Invoice request for a hire",
      ),
    },
    {
      id: "confirmed",
      label: "6 · Brief confirmed",
      to: d.email,
      subject: `Brief confirmed: ${d.roles.length > 1 ? `${d.roles.length} roles` : d.roles[0]}`,
      html: layout(
        h1("Your brief is confirmed") +
          p(`I've been through it, ${d.first}, and we're good to go. Your search week is <strong>${d.week}</strong>.`) +
          (d.retainer ? p(`One thing to check: your retainer invoice (${d.retainer}) needs paying before ${d.weekStart} to keep your week.`) : "") +
          p("Next you'll hear from me with your candidates.") +
          signoff,
        `Search week ${d.week}`,
      ),
    },
    {
      id: "tracker",
      label: "7 · First shortlist + tracker invite",
      to: d.email,
      subject: `Your 5 candidates: ${d.shortlistRole ?? d.roles[0]}`,
      html: layout(
        h1("Your candidates are in") +
          p(`${d.first}, your 5 candidates for <strong>${esc(d.shortlistRole ?? d.roles[0])}</strong> are ready, each with a short note on why they're on the list. They're in a private tracker I've set up for ${esc(d.company)}: look out for an email from Airtable inviting you to it.`) +
          p("<strong>How it works</strong>") +
          steps([
            "Every candidate we put forward appears there with their CV, links and my notes.",
            "Each candidate has their own comments thread. Ask questions or give feedback right on their record, and I'll reply there. No email chains.",
            "Your portal shows where everything is: search week, shortlist, interviews and documents.",
          ]) +
          button("Open your tracker", tracker) +
          signoff,
        `Your 5 candidates for ${d.shortlistRole ?? d.roles[0]} are ready`,
      ),
    },
    {
      id: "shortlist",
      label: "8 · Next shortlists",
      to: d.email,
      subject: `Your 5 candidates: ${slRole}`,
      html: layout(
        h1("Your shortlist is in") +
          p(`${d.first}, your 5 candidates for <strong>${esc(slRole)}</strong> are in your tracker, each with a short note on why they're on the list.`) +
          p("Comment on any of them to tell me who you'd like to meet, and I'll book the interviews.") +
          button("See your candidates", tracker) +
          signoff,
        `5 candidates for ${slRole}`,
      ),
    },
    {
      id: "alert",
      label: "9 · New booking (to you)",
      to: "andre@makersforge.gg",
      subject: `New booking: ${d.company}, ${d.plan}`,
      html: layout(
        h1(`New booking: ${esc(d.company)}`) +
          rows([
            ["Contact", `${d.contact} · ${d.email}`],
            ["Plan", d.plan],
            ["Search week", d.week],
            [d.roles.length > 1 ? "Roles" : "Role", roles],
            ...(d.retainer ? ([["Retainer", `${d.retainer} · invoice details in a separate email`]] as [string, string][]) : []),
            ["Terms", `Signed by ${d.signedBy}, ${d.signedAt}`],
          ]) +
          button("Confirm the brief", `${SITE}/admin`),
        `${d.company} booked ${d.week}`,
      ),
    },
  ];
}
