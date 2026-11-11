/**
 * What's Appening emails. ALL WORDING IS DRAFT until Andre approves it
 * (preview them at /emails-preview?set=appening on a preview build).
 */
import { layout } from "@/lib/clientEmails";
import type { Entry, IssueWithEntries } from "./data";
import { EDITION_NAME, niceDate } from "./schedule";

export const SITE = "https://www.makersforge.gg";
export const NAME = "What's Appening";
export const issuePath = (i: { edition: string; number: number }) => `/whats-appening/${i.edition}/${i.number}`;
export const issueTitle = (i: { edition: "games" | "apps"; number: number }) => `${NAME}: ${EDITION_NAME[i.edition]} #${i.number}`;

const INK = "#16181d";
const DIM = "#5b5f69";
const HAIR = "#e7e1d8";
const ORANGE = "#ff5d00";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const p = (t: string) => `<p style="margin:0 0 14px">${t}</p>`;
const hi = (n: string | null | undefined) => p(`Hi ${esc(n?.split(" ")[0] || "there")},`);
const sign = p(`Andre<br><span style="color:${DIM};font-size:14px">Founder, MakersForge</span>`);
const button = (label: string, href: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 20px"><tr><td bgcolor="${ORANGE}" style="border-radius:999px">
<a href="${href}" style="display:inline-block;padding:13px 24px;font-weight:700;font-size:15px;color:#fff;text-decoration:none;border-radius:999px">${label} →</a>
</td></tr></table>`;

/** Studio applied. */
export function appliedEmail(e: Entry) {
  const html = layout(
    hi(e.contact_name) +
      p(`Thanks for putting <strong>${esc(e.name)}</strong> forward for ${NAME}.`) +
      p(`We pick a handful of new ${e.edition} for each issue. If ${esc(e.name)} is in one, I'll email you the date before it goes out.`) +
      sign,
    `${e.name} is in the queue`,
  );
  return { subject: `${e.name} is in the queue for ${NAME}`, html };
}

/** Booked into an issue (sent when Andre approves the issue). */
export function bookedEmail(e: Entry, i: IssueWithEntries, date: string) {
  const spot = e.slot === "spotlight";
  const html = layout(
    hi(e.contact_name) +
      p(
        spot
          ? `Good news: <strong>${esc(e.name)}</strong> is one of the three spotlights in ${esc(issueTitle(i))}, out <strong>${niceDate(date)}</strong>.`
          : `Good news: <strong>${esc(e.name)}</strong> is in ${esc(issueTitle(i))}, out <strong>${niceDate(date)}</strong>.`,
      ) +
      p(`I'll send you the link on the day so you can share it.`) +
      sign,
    `${e.name} is in ${issueTitle(i)}`,
  );
  return { subject: `${e.name} is in ${issueTitle(i)}`, html };
}

/** Issue is out: to each featured studio with an email. */
export function liveEmail(e: Entry, i: IssueWithEntries) {
  const url = `${SITE}${issuePath(i)}?utm_source=email&utm_medium=appening&utm_campaign=featured`;
  const html = layout(
    hi(e.contact_name) + p(`${esc(issueTitle(i))} is out, with <strong>${esc(e.name)}</strong> in it.`) + button("See it", url) + p(`Share it wherever you like. Congratulations on the launch.`) + sign,
    `${e.name} is in today's issue`,
  );
  return { subject: `${e.name} is in today's ${NAME}`, html };
}

/** Email apps can't play video: show the trailer's thumbnail with a play button, linking to the video. */
function trailerBlock(e: Entry) {
  if (e.origin !== "applied" || !e.trailer_url) return "";
  const yt = e.trailer_url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  const pill = `<a href="${esc(e.trailer_url)}" style="display:inline-block;margin-top:8px;padding:8px 14px;border-radius:999px;background:${ORANGE};color:#fff;font-weight:700;font-size:13px;text-decoration:none">▶ Watch the trailer</a>`;
  if (!yt) return `<div style="margin-top:4px">${pill}</div>`;
  return `<a href="${esc(e.trailer_url)}" style="display:block;margin-top:14px"><img src="https://i.ytimg.com/vi/${yt[1]}/hqdefault.jpg" width="100%" alt="${esc(e.name)} trailer" style="display:block;width:100%;border-radius:10px"></a>${pill}`;
}

/** The issue itself, to subscribers. */
export function issueEmail(i: IssueWithEntries, token: string) {
  const url = `${SITE}${issuePath(i)}?utm_source=email&utm_medium=appening&utm_campaign=issue`;
  // Same hierarchy as the site (Andre 2026-11-11): the name is the headline, studio under it,
  // tagline in plain grey, "Our take" with the orange rule. Full width so it reads on a phone.
  const storeName = (s: string) => (s === "ios" ? "the App Store" : "Google Play");
  const spots = i.spotlights
    .map((e, n) => {
      const studioLink = e.studio_linkedin || e.website;
      const studio = e.publisher ? (studioLink ? `<a href="${esc(studioLink)}" style="color:${ORANGE};font-weight:700;text-decoration:none">${esc(e.publisher)}</a>` : esc(e.publisher)) : "";
      const shot = !e.trailer_url && e.origin === "applied" && e.screenshots[0];
      return `<div style="${n ? `border-top:1px solid ${HAIR};padding-top:26px;` : ""}margin:0 0 26px">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td valign="middle" style="padding-right:14px">${e.icon_url ? `<img src="${esc(e.icon_url)}" width="56" height="56" alt="" style="display:block;border-radius:13px">` : ""}</td>
<td valign="middle"><div style="font-size:21px;font-weight:700;line-height:1.2;color:${INK}">${esc(e.name)}</div>
<div style="font-size:14px;color:${DIM};margin-top:3px">${[studio, e.genre && esc(e.genre)].filter(Boolean).join(" · ")}</div></td>
</tr></table>
${e.tagline ? `<p style="margin:12px 0 0;font-size:15.5px;line-height:1.5;color:${DIM}">${esc(e.tagline)}</p>` : ""}
${trailerBlock(e)}${shot ? `<a href="${esc(e.store_url)}" style="display:block;margin-top:14px"><img src="${esc(shot)}" width="100%" alt="${esc(e.name)} screenshot" style="display:block;width:100%;border-radius:10px"></a>` : ""}
${e.take ? `<p style="margin:16px 0 0;font-size:16px;line-height:1.55;color:${INK}">${esc(e.take)}</p>` : ""}
${e.publisher ? `<p style="margin:12px 0 0;font-size:13.5px;color:${DIM}">Built by ${studio}${e.builders?.length ? ` · ${esc(e.builders.map((b) => (b.role ? `${b.name}, ${b.role}` : b.name)).join(" · "))}` : ""}</p>` : ""}
<p style="margin:12px 0 0"><a href="${esc(e.store_url)}" style="color:${ORANGE};font-weight:700;font-size:14.5px;text-decoration:none">Get it on ${storeName(e.store)} →</a>${e.other_store_url ? ` &nbsp; <a href="${esc(e.other_store_url)}" style="color:${ORANGE};font-weight:700;font-size:14.5px;text-decoration:none">${storeName(e.store === "ios" ? "android" : "ios")} →</a>` : ""}</p>
</div>`;
    })
    .join("");
  const list = i.list.length
    ? `<p style="margin:22px 0 8px;font-weight:700">Also new</p><ul style="margin:0 0 18px;padding-left:20px">${i.list
        .map((e) => `<li style="margin:0 0 6px"><a href="${esc(e.store_url)}" style="color:${INK};font-weight:600">${esc(e.name)}</a> <span style="color:${DIM}">${esc(e.publisher || "")}</span></li>`)
        .join("")}</ul>`
    : "";
  const html = layout(
    `<div style="font-size:13px;font-weight:700;color:${DIM}">What's Appening</div><h1 style="margin:2px 0 22px;font-size:30px;line-height:1.1;color:${INK}">${EDITION_NAME[i.edition]} <span style="color:${ORANGE}">#${i.number}</span></h1>` +
      (i.intro ? p(esc(i.intro)) : "") +
      spots +
      list +
      button("Read it on the site", url) +
      p(`<span style="font-size:13px;color:${DIM}">Launching something? <a href="${SITE}/whats-appening/apply" style="color:${DIM}">Put it forward</a>. · <a href="${SITE}/whats-appening/unsubscribe?t=${token}" style="color:${DIM}">Unsubscribe</a></span>`),
    i.spotlights.map((e) => e.name).join(", "),
  );
  return { subject: `${issueTitle(i)}: ${i.spotlights.map((e) => e.name).join(", ")}`, html };
}
