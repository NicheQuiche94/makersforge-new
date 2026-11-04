/**
 * The signed Terms of Business as HTML (for the PDF) plus a fingerprint of
 * the exact wording, stored with the signature so we can always show which
 * text a client agreed to. Wording comes from lib/termsOfBusiness.ts, which
 * Andre signed off on 2026-11-02; only the variables change per client.
 */
import { createHash } from "node:crypto";
import { buildTerms, MF_NUMBER, MF_OFFICE, type Clause, type TermsVariant } from "@/lib/termsOfBusiness";
import { TERMS } from "@/lib/plans";

export type TermsInput = {
  variant: TermsVariant;
  retained: boolean;
  roles: number;
  date: string; // "4 November 2026"
  client: string;
  clientNumber: string;
  clientAddress: string;
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function flat(c: Clause, out: string[]) {
  out.push(`${c.n ?? ""} ${c.text}`.trim());
  c.sub?.forEach((s) => flat(s, out));
}

export function termsDoc(v: TermsInput) {
  const t = buildTerms({
    variant: v.variant,
    retained: v.retained,
    roles: v.roles,
    date: v.date,
    client: v.client,
    clientNumber: v.clientNumber,
    clientAddress: v.clientAddress,
    contractFee: "£1,000",
    cancelFee: TERMS.cancelFee,
    cancelHours: TERMS.cancelHours,
  });
  const lines: string[] = [];
  t.parties.forEach((c) => flat(c, lines));
  t.sections.forEach((s) => {
    lines.push(s.title);
    s.clauses.forEach((c) => flat(c, lines));
  });
  const hash = createHash("sha256").update(lines.join("\n")).digest("hex").slice(0, 16);
  return { terms: t, hash };
}

const clauseHtml = (c: Clause): string =>
  `<div class="c"><p>${c.n ? `<b>${esc(c.n)}</b> ` : ""}${esc(c.text)}</p>${c.sub ? `<div class="sub">${c.sub.map(clauseHtml).join("")}</div>` : ""}</div>`;

export function termsHtml(v: TermsInput, sig: { name: string; title: string; email: string; signedAt: string; ip: string; ref: string }) {
  const { terms, hash } = termsDoc(v);
  return {
    hash,
    html: `<!doctype html><html><head><meta charset="utf-8"><title>MakersForge Terms of Business</title><style>
      body{font-family:Helvetica,Arial,sans-serif;font-size:10.5pt;line-height:1.5;color:#16181d}
      h1{font-size:17pt;margin:0 0 4pt} .muted{color:#5b5f69;font-size:9pt}
      h2{font-size:11pt;margin:16pt 0 6pt} .c p{margin:0 0 5pt} .sub{padding-left:16pt}
      .sig{margin-top:22pt;border-top:1px solid #ccc;padding-top:10pt;page-break-inside:avoid}
      .sig table{width:100%;border-collapse:collapse} .sig td{vertical-align:top;padding:4pt 8pt 4pt 0;width:50%}
    </style></head><body>
      <h1>Terms of Business</h1>
      <p class="muted">MakersForge Ltd · company number ${MF_NUMBER} · ${esc(MF_OFFICE)} · booking ${esc(sig.ref)}</p>
      ${terms.parties.map(clauseHtml).join("")}
      ${terms.sections.map((s) => `<h2>${esc(s.title)}</h2>${s.clauses.map(clauseHtml).join("")}`).join("")}
      <div class="sig"><table><tr>
        <td><b>Signed for MakersForge Ltd</b><br>Andre Lemaitre, Founder<br>${esc(v.date)}</td>
        <td><b>Signed for ${esc(v.client)}</b><br>${esc(sig.name)}, ${esc(sig.title)}<br>${esc(sig.email)}<br>Signed electronically ${esc(sig.signedAt)}<br><span class="muted">IP ${esc(sig.ip)} · terms version ${hash}</span></td>
      </tr></table></div>
    </body></html>`,
  };
}
