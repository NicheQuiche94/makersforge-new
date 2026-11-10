/**
 * The job ad analysis, as it's delivered (Andre 2026-11-08: "laying the
 * analysis out in plain text in an email is not going to work; it needs to be
 * all nice"). Two pieces:
 *  - the email: the analysis itself, designed (score, verdict, section bars,
 *    the 3 biggest fixes) plus a one-click "rewrite it for me";
 *  - the PDF report, attached: the full breakdown with what we found, to keep
 *    or forward to the team.
 * Email HTML sticks to tables and inline styles so it holds up in Gmail and
 * Outlook.
 */
import { layout } from "@/lib/clientEmails";
import { GROUPS, type Result } from "@/lib/adGrader";

const INK = "#0e0f11";
const DIM = "#5b5f69";
const HAIR = "#ece7df";
const ORANGE = "#ff5d00";
const TONE: Record<string, string> = { great: "#16a34a", good: "#65a30d", warn: "#f59e0b", bad: "#ef4444" };
const MARK: Record<string, [string, string, string]> = {
  yes: ["✓", "#15803d", "#e7f6ec"],
  partly: ["~", "#b45309", "#fdf1dc"],
  no: ["✗", "#b91c1c", "#fde8e8"],
};
const esc = (s: string) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export type Links = { online: string; rewrite: string; pdf: string; ring: string };

/* ---------- the email ----------
 * Ashley's QA (2026-11-10): fewer sections, one direct flow. The ring like the
 * PDF, the score, the single biggest gap with its fix, then two buttons
 * (full report / fix it for me). No extra subtext to skim past. */
export function gradeEmail(r: Result, title: string | undefined, links: Links) {
  const top = r.fixes[0];
  const item = top && r.items.find((i) => i.label === top.label);
  const btn = (label: string, href: string, solid: boolean) =>
    `<table role="presentation" cellpadding="0" cellspacing="0" style="display:inline-block;margin:0 10px 10px 0;vertical-align:top"><tr><td ${solid ? `bgcolor="${ORANGE}"` : ""} style="border-radius:999px;${solid ? "" : `border:2px solid ${INK};`}">
<a href="${href}" style="display:inline-block;padding:${solid ? "13px 22px" : "11px 20px"};font-weight:800;font-size:15px;color:${solid ? "#fff" : INK};text-decoration:none;border-radius:999px">${label}</a></td></tr></table>`;
  const body = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px"><tr>
<td width="132" valign="middle"><img src="${links.ring}" width="120" height="120" alt="${r.score}/100" style="display:block;border:0"></td>
<td valign="middle" style="padding-left:12px"><div style="font-size:24px;font-weight:800;line-height:1.25;color:${INK}">Your job ad scored ${r.score}/100</div>${title ? `<div style="color:${DIM};font-size:14px;margin-top:4px">${esc(title)}</div>` : ""}</td>
</tr></table>
${
  top
    ? `<p style="margin:0 0 8px;font-size:17px;font-weight:800">One way to improve it</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border:1px solid ${HAIR};border-radius:12px"><tr><td style="padding:16px 18px">
<div style="font-size:15.5px;font-weight:800">${esc(top.label)}</div>
${item?.note ? `<div style="color:${DIM};font-size:14px;margin-top:2px">${esc(item.note)}</div>` : ""}
<div style="margin-top:10px;padding:10px 12px;background:#fff1e6;border-radius:8px;font-size:14.5px;line-height:1.5"><b>Fix:</b> ${esc(top.fix)}</div>
</td></tr></table>`
    : ""
}
<div style="margin:0 0 18px">${btn("Download the full report", links.pdf, false)}${btn("Fix it for me →", links.rewrite, true)}</div>
<p style="margin:0">Andre<br><span style="color:${DIM};font-size:14px">Founder, MakersForge</span></p>`;
  return layout(body, `Your job ad scored ${r.score}/100. One way to improve it inside.`);
}

/* The previous, fuller email (before Ashley's QA), kept for reference. */
export function gradeEmailFull(r: Result, title: string | undefined, links: Links) {
  const tone = TONE[r.band.tone];
  const bars = r.groups
    .map((g) => {
      const pct = Math.max(3, Math.round((g.got / g.max) * 100));
      return `<tr>
<td width="44%" style="padding:7px 12px 7px 0;font-size:14px">${esc(g.title)}</td>
<td width="40%" style="padding:7px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:4px;background:#eeeae4"><tr>
<td width="${pct}%" height="8" style="height:8px;line-height:8px;font-size:1px;background:${ORANGE};border-radius:4px">&nbsp;</td>${pct < 100 ? `<td width="${100 - pct}%" height="8" style="height:8px;line-height:8px;font-size:1px">&nbsp;</td>` : ""}
</tr></table></td>
<td width="16%" style="padding:7px 0 7px 12px;font-size:14px;font-weight:700;text-align:right;white-space:nowrap">${g.got}/${g.max}</td>
</tr>`;
    })
    .join("");
  const fixes = r.fixes
    .map(
      (f, i) => `<tr><td style="padding:0 0 10px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${HAIR};border-radius:12px"><tr>
<td width="44" valign="top" style="padding:14px 0 14px 14px"><div style="width:30px;height:30px;line-height:30px;border-radius:15px;background:${ORANGE};color:#fff;text-align:center;font-weight:800">${i + 1}</div></td>
<td style="padding:14px 10px"><b style="font-size:15px">${esc(f.label)}</b><br><span style="color:${DIM};font-size:14px;line-height:1.5">${esc(f.fix)}</span></td>
<td width="44" valign="top" style="padding:14px 14px 14px 0;color:#16a34a;font-weight:800;text-align:right">+${f.lost}</td>
</tr></table></td></tr>`,
    )
    .join("");

  const body = `
<p style="margin:0 0 4px;color:${DIM};font-size:14px">Your job ad analysis${title ? `: ${esc(title)}` : ""}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:10px 0 22px"><tr>
<td width="120" valign="middle"><div style="width:96px;height:96px;border-radius:56px;border:8px solid ${tone};text-align:center">
<div style="padding-top:22px;font-size:38px;font-weight:800;line-height:1;color:${INK}">${r.score}</div><div style="font-size:12px;color:${DIM};margin-top:4px">/ 100</div>
</div></td>
<td valign="middle" style="padding-left:18px"><div style="font-size:22px;font-weight:800;line-height:1.2;color:${INK}">${esc(r.band.label)}</div>
<div style="color:${DIM};font-size:14.5px;line-height:1.5;margin-top:4px">${esc(r.band.line)}</div></td>
</tr></table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px">${bars}</table>

<p style="margin:0 0 10px;font-size:17px;font-weight:800">Your biggest fixes</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 14px">${fixes}</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 22px"><tr><td style="background:${ORANGE};background-image:linear-gradient(135deg,#ff7a2b,#e14b00);border-radius:16px;padding:22px 22px 20px;color:#fff">
<div style="font-size:20px;font-weight:800;line-height:1.25">Want it at 90+? I'll rewrite it for you.</div>
<div style="font-size:14.5px;line-height:1.55;margin:8px 0 16px;color:#fff">I'll edit it myself, by hand, and send it back within 2 working days. If it doesn't score 90 or more, I'll keep going until it does.</div>
<table role="presentation" cellpadding="0" cellspacing="0"><tr><td bgcolor="#ffffff" style="border-radius:999px">
<a href="${links.rewrite}" style="display:inline-block;padding:12px 22px;font-weight:800;font-size:15px;color:#c2410c;text-decoration:none;border-radius:999px">Rewrite my ad for me →</a>
</td></tr></table>
</td></tr></table>

<p style="margin:0 0 14px;font-size:14.5px">The full breakdown, line by line, is in the PDF attached, ready to share with your team. You can also <a href="${links.online}" style="color:#e14b00;font-weight:700">see it online</a>.</p>
<p style="margin:0 0 14px">Andre<br><span style="color:${DIM};font-size:14px">Founder, MakersForge</span></p>`;
  return layout(body, `${r.score}/100: ${r.band.label}. Your 3 biggest fixes inside.`);
}

/* ---------- the PDF report ---------- */
export function gradePdfHtml(r: Result, title: string | undefined, date = new Date()) {
  const tone = TONE[r.band.tone];
  const groups = GROUPS.map((g) => {
    const items = r.items.filter((i) => i.group === g.id);
    const got = items.reduce((a, i) => a + i.got, 0);
    const max = items.reduce((a, i) => a + i.weight, 0);
    return `<section class="grp">
<div class="grpHead"><div><h3>${esc(g.title)}</h3><p>${esc(g.blurb)}</p></div><b>${got}/${max}</b></div>
${items
  .map((i) => {
    const [m, c, bg] = MARK[i.status];
    return `<div class="row"><span class="mark" style="color:${c};background:${bg}">${m}</span><div class="txt"><div class="lab">${esc(i.label)}</div>${i.note ? `<div class="note">${esc(i.note)}</div>` : ""}${i.got < i.weight ? `<div class="fix"><b>Fix:</b> ${esc(i.fix)}</div>` : ""}</div><span class="pts">${i.got}/${i.weight}</span></div>`;
  })
  .join("")}
</section>`;
  }).join("");

  return `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Cal+Sans&family=Figtree:wght@400;600;700;800&display=swap');
* { box-sizing: border-box; }
body { margin: 0; font-family: Figtree, Helvetica, Arial, sans-serif; color: ${INK}; font-size: 12.5px; line-height: 1.5; }
.top { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; border-radius: 12px; background: ${INK}; border-bottom: 3px solid #ff5d00; }
.top img { height: 26px; }
.top span { color: rgba(255,255,255,0.75); font-size: 11px; }
h1 { font-family: "Cal Sans", Figtree, sans-serif; font-weight: 400; font-size: 30px; letter-spacing: -0.02em; margin: 22px 0 2px; }
.sub { color: ${DIM}; margin: 0 0 18px; }
.hero { display: flex; gap: 22px; align-items: center; padding: 18px; border: 1px solid ${HAIR}; border-radius: 14px; }
.ring { width: 110px; height: 110px; border-radius: 50%; display: grid; place-content: center; text-align: center; background: radial-gradient(closest-side, #fff 78%, transparent 79% 100%), conic-gradient(${tone} ${r.score}%, #eeeae4 0); }
.ring b { font-family: "Cal Sans", Figtree, sans-serif; font-size: 40px; line-height: 1; }
.ring span { font-size: 10px; color: ${DIM}; }
.hero h2 { font-family: "Cal Sans", Figtree, sans-serif; font-weight: 400; font-size: 22px; margin: 0 0 4px; }
.hero p { margin: 0 0 4px; color: ${DIM}; }
.bars { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 14px 0 18px; }
.bar { border: 1px solid ${HAIR}; border-radius: 10px; padding: 10px; }
.bar div { display: flex; justify-content: space-between; font-weight: 700; font-size: 11.5px; }
.bar i { display: block; height: 6px; border-radius: 3px; background: #eeeae4; margin-top: 8px; overflow: hidden; }
.bar i em { display: block; height: 100%; background: linear-gradient(90deg,#ff8a00,#e14b00); }
.fixes h3, .grp h3 { font-family: "Cal Sans", Figtree, sans-serif; font-weight: 400; font-size: 17px; margin: 0; }
.fixes { margin-bottom: 16px; }
.fixes ol { margin: 8px 0 0; padding-left: 18px; }
.fixes li { margin-bottom: 6px; }
.fixes li b { font-size: 13px; }
.fixes li span { color: ${DIM}; }
.grp { margin-bottom: 14px; }
.grpHead { break-after: avoid; }
.grpHead { display: flex; justify-content: space-between; align-items: end; margin-bottom: 6px; }
.grpHead p { margin: 0; color: ${DIM}; font-size: 11.5px; }
.grpHead b { font-size: 14px; }
.row { display: flex; gap: 10px; align-items: flex-start; padding: 8px 0; border-top: 1px solid ${HAIR}; break-inside: avoid; }
.mark { flex: none; width: 20px; height: 20px; border-radius: 10px; display: grid; place-items: center; font-weight: 800; font-size: 11px; }
.txt { flex: 1; }
.lab { font-weight: 700; }
.note { color: ${DIM}; font-size: 11.5px; }
.fix { font-size: 11.5px; margin-top: 2px; }
.pts { font-weight: 800; color: ${DIM}; }
.offer { break-inside: avoid; margin-top: 18px; padding: 18px; border-radius: 14px; background: linear-gradient(135deg,#ff7a2b,#e14b00); color: #fff; }
.offer h3 { font-family: "Cal Sans", Figtree, sans-serif; font-weight: 400; font-size: 18px; margin: 0 0 4px; }
.offer p { margin: 0; }
.foot { margin-top: 16px; color: ${DIM}; font-size: 10.5px; }
</style></head><body>
<div class="top"><img src="https://www.makersforge.gg/images/mf-icon-white.png" alt="MakersForge"><span>Job ad analysis · ${date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span></div>
<h1>${esc(title || "Your job ad")}</h1>
<p class="sub">Scored against what strong candidates look for before they apply.</p>
<div class="hero">
  <div class="ring"><b>${r.score}</b><span>/ 100</span></div>
  <div><h2>${esc(r.band.label)}</h2><p>${esc(r.band.line)}</p></div>
</div>
<div class="bars">${r.groups.map((g) => `<div class="bar"><div><span>${esc(g.title)}</span><span>${g.got}/${g.max}</span></div><i><em style="width:${(g.got / g.max) * 100}%"></em></i></div>`).join("")}</div>
${r.fixes.length ? `<div class="fixes"><h3>Your biggest fixes</h3><ol>${r.fixes.map((f) => `<li><b>${esc(f.label)}</b> <span>(+${f.lost})</span><br><span>${esc(f.fix)}</span></li>`).join("")}</ol></div>` : ""}
${groups}
<div class="offer"><h3>Want it at 90+? I'll rewrite it for you.</h3><p>I'll edit it by hand and send it back within 2 working days. Reply to the email this came with, or email andre@makersforge.gg.</p></div>
<p class="foot">MakersForge · Recruitment for mobile games and consumer apps · makersforge.gg/job-ad-grading-tool</p>
</body></html>`;
}
