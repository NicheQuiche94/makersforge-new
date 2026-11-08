/**
 * Hiring guides (Andre 2026-11-08). Practical, operational answers to the
 * questions studios ask about hiring in mobile games and apps, written by
 * Andre by hand (never AI-drafted: readers sent here by ChatGPT or Claude
 * want a real person's view). Each question is its own page so AI tools and
 * search engines can cite it; the "In short" answer is the part they quote.
 *
 * To publish one: paste Andre's text into `body`, write `short` with him,
 * set `published` to the date it goes live. Unpublished guides only show
 * on previews and locally, so the section fills in piece by piece.
 *
 * Any guide can carry a lead magnet: a takeaway (blueprint, checklist,
 * scorecard) derived from the article, sent by email in exchange for an
 * address. Leave `magnet` out until the file exists.
 *
 * Body format (plain text, as Andre writes it):
 *   blank line = new paragraph · "## " heading · "### " subheading
 *   "- " bullet · "1. " numbered · "> " pull quote
 *   **bold** · *italic* · [link text](https://…)
 */
export type GuideGroup = "before" | "process" | "right";

export type Magnet = {
  name: string; // "The 5-step hiring efficiency blueprint"
  pitch: string; // one line on what's in it
  file: string; // path under /public, e.g. /guides/files/efficiency-blueprint.pdf
};

export type Guide = {
  slug: string;
  q: string; // the question, as people ask it
  group: GuideGroup;
  teaser: string; // one line on the questions page
  short: string; // "In short": 2–3 sentences that answer it outright
  body: string; // Andre's article
  published: string | null; // yyyy-mm-dd, or null while it's being written
  updated?: string;
  magnet?: Magnet;
};

export const GROUPS: { id: GuideGroup; title: string; blurb: string }[] = [
  { id: "before", title: "Before you hire", blurb: "Knowing when, who and what it'll take." },
  { id: "process", title: "Running the process", blurb: "Faster, lighter hiring that doesn't eat your team's week." },
  { id: "right", title: "Getting it right", blurb: "Hiring for what matters, and making it stick." },
];

export const AUTHOR = { name: "Andre", role: "Founder, MakersForge" };

// Questions agreed with Andre 2026-11-08. Bodies are his to write.
export const GUIDES: Guide[] = [
  { slug: "ready-to-hire", group: "before", q: "How do I know when I'm ready to hire?", teaser: "The signs it's time, and the ones that mean wait.", short: "", body: "", published: null },
  { slug: "full-time-contractor-or-agency", group: "before", q: "Should my next hire be full-time, a contractor or an agency?", teaser: "Matching the shape of the hire to the shape of the work.", short: "", body: "", published: null },
  { slug: "real-cost-of-hiring", group: "before", q: "What does hiring really cost, beyond the fee?", teaser: "Fees, team hours and the cost of a slow or wrong hire.", short: "", body: "", published: null },
  { slug: "reduce-time-to-hire", group: "process", q: "How do I reduce my time to hire?", teaser: "Where the weeks actually go, and how to win them back.", short: "", body: "", published: null },
  { slug: "efficient-hiring-process", group: "process", q: "How can I make my hiring process more efficient?", teaser: "Less of your team's time for a better result.", short: "", body: "", published: null },
  { slug: "interview-stages", group: "process", q: "How many interview stages do I need, and what should each one test?", teaser: "A process candidates respect and that tells you what you need.", short: "", body: "", published: null },
  { slug: "stop-losing-candidates", group: "process", q: "How do I stop losing good candidates halfway through?", teaser: "Why strong people drop out, and how to keep them.", short: "", body: "", published: null },
  { slug: "hire-for-what-matters", group: "right", q: "How do I hire for the things that actually matter?", teaser: "Looking past the CV to what predicts success in the role.", short: "", body: "", published: null },
  { slug: "games-job-spec", group: "right", q: "What does a good job spec look like for a games role?", teaser: "Specs that attract the right people and put off the wrong ones.", short: "", body: "", published: null },
  { slug: "first-90-days", group: "right", q: "How do I give a new hire the best start in their first 90 days?", teaser: "Turning a good hire into a great one.", short: "", body: "", published: null },
];

/** Live: published guides only. Previews and local dev also see drafts. */
export const showDrafts = () => process.env.VERCEL_ENV !== "production";
export const isLive = (g: Guide) => !!g.published && !!g.body.trim();
export const visibleGuides = () => GUIDES.filter((g) => isLive(g) || showDrafts());
export const guideBySlug = (slug: string) => visibleGuides().find((g) => g.slug === slug);
export const liveGuides = () => GUIDES.filter(isLive);

/* ---------- Andre's plain text → blocks ---------- */
export type Inline = { t: "text" | "b" | "i" | "a"; v: string; href?: string };
export type Block =
  | { k: "p" | "h2" | "h3" | "quote"; parts: Inline[] }
  | { k: "ul" | "ol"; items: Inline[][] };

export function inline(s: string): Inline[] {
  const out: Inline[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g;
  let last = 0;
  for (let m; (m = re.exec(s)); ) {
    if (m.index > last) out.push({ t: "text", v: s.slice(last, m.index) });
    if (m[1]) out.push({ t: "b", v: m[1] });
    else if (m[2]) out.push({ t: "i", v: m[2] });
    else out.push({ t: "a", v: m[3], href: m[4] });
    last = re.lastIndex;
  }
  if (last < s.length) out.push({ t: "text", v: s.slice(last) });
  return out;
}

export function blocks(body: string): Block[] {
  return body
    .replace(/\r/g, "")
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((c): Block => {
      const lines = c.split("\n").map((l) => l.trim());
      if (lines.every((l) => /^[-•]\s+/.test(l))) return { k: "ul", items: lines.map((l) => inline(l.replace(/^[-•]\s+/, ""))) };
      if (lines.every((l) => /^\d+[.)]\s+/.test(l))) return { k: "ol", items: lines.map((l) => inline(l.replace(/^\d+[.)]\s+/, ""))) };
      if (c.startsWith("### ")) return { k: "h3", parts: inline(c.slice(4)) };
      if (c.startsWith("## ")) return { k: "h2", parts: inline(c.slice(3)) };
      if (c.startsWith("> ")) return { k: "quote", parts: inline(lines.map((l) => l.replace(/^>\s?/, "")).join(" ")) };
      return { k: "p", parts: inline(lines.join(" ")) };
    });
}

/** Reading time from the body, rounded up. */
export const readMins = (g: Guide) => Math.max(1, Math.ceil(g.body.split(/\s+/).filter(Boolean).length / 220));
