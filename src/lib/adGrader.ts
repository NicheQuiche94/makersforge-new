/**
 * Job ad grading tool (MOCKUP, Andre 2026-11-08). Scores a job ad out of 100
 * against Andre's view of a healthy ad: the basics a candidate needs, why the
 * role exists (the outcome), requirement discipline, and the candidate's
 * experience. Weights are a first draft to tune by trying real ads.
 *
 * The mock reads the ad with plain rules (no API key yet). The live version
 * can have Claude answer each check as yes / partly / no with the line it's
 * based on; the score stays simple arithmetic on those answers, so the same
 * ad always gets the same score and every point is explained.
 */
export type Status = "yes" | "partly" | "no";
export type GroupId = "basics" | "why" | "discipline" | "experience";

export const GROUPS: { id: GroupId; title: string; blurb: string }[] = [
  { id: "basics", title: "The basics", blurb: "Can a candidate even consider it?" },
  { id: "why", title: "Why the role exists", blurb: "The problem this hire solves." },
  { id: "discipline", title: "Requirement discipline", blurb: "Asking for what the outcome needs, not a wishlist." },
  { id: "experience", title: "Candidate experience", blurb: "Easy to read, clear what happens next." },
];

export type Check = { status: Status; note: string };
export type Criterion = {
  id: string;
  group: GroupId;
  label: string;
  weight: number;
  fix: string; // what to do when it's missing
  check: (ad: Ad) => Check;
};
export type Ad = { text: string; title: string; lines: string[]; lower: string };

export const BANDS = [
  { min: 85, label: "A great ad", tone: "great", line: "Strong candidates will read this and know straight away whether it's for them." },
  { min: 70, label: "A good ad", tone: "good", line: "Solid, with a few gaps that cost you some of the best applicants." },
  { min: 50, label: "Losing candidates", tone: "warn", line: "The people you most want are likely skipping it for an ad that tells them more." },
  { min: 0, label: "Most good people scroll past", tone: "bad", line: "It's missing the things candidates look for first." },
] as const;
export const bandFor = (score: number) => BANDS.find((b) => score >= b.min)!;

/* ---------- reading the ad ---------- */
const MONEY = /(?:[£$€]\s?\d[\d,.]*\s?(?:k|K|000)?|\d[\d,.]*\s?(?:k|K)\s?(?:[£$€]|GBP|EUR|USD))/;
const RANGE = new RegExp(`${MONEY.source}\\s*(?:-|–|—|to)\\s*(?:[£$€])?\\s?\\d[\\d,.]*\\s?(?:k|K|000)?`);
const LEVEL = /\b(intern|junior|graduate|associate|mid|senior|sr\.?|lead|principal|staff|head|director|vp|chief|manager|specialist|executive|coordinator|analyst|artist|designer|engineer|producer)\b/i;
const BUZZ = /\b(rockstar|ninja|guru|wizard|unicorn|superstar|jedi|hero|evangelist)\b/i;

function heading(l: string) {
  const raw = l.trim();
  if (isBullet(raw)) return false;
  // Strip markdown and leading emoji: "**🤩 We’d love to hear from you if…**" → "We’d love to hear from you if…"
  const t = raw.replace(/[*#_]/g, "").replace(/^[^A-Za-z0-9]+/, "").trim();
  if (!t || t.length > 70) return false;
  if (/^\*\*.+\*\*:?$/.test(raw) || /^#{1,4}\s/.test(raw)) return true;
  if (/[:…]$/.test(t) && t.split(/\s+/).length <= 9) return true;
  return t.split(/\s+/).length <= 5 && !/[.!?]$/.test(t) && /^[A-Z]/.test(t);
}
const isBullet = (l: string) => /^\s*(?:[-•*·▪●◦]|\d+[.)])\s+/.test(l);

/** Bullets under the first heading matching `re`, up to the next heading. */
function section(ad: Ad, re: RegExp) {
  const i = ad.lines.findIndex((l) => heading(l) && re.test(l));
  if (i < 0) return null;
  const out: string[] = [];
  for (const l of ad.lines.slice(i + 1)) {
    if (heading(l) && !isBullet(l)) break;
    if (isBullet(l)) out.push(l);
  }
  return out;
}

const count = (s: string, res: RegExp[]) => res.filter((r) => r.test(s)).length;
const quote = (ad: Ad, re: RegExp) => {
  const m = ad.text.match(new RegExp(`[^.\\n]{0,60}${re.source}[^.\\n]{0,60}`, re.flags.replace("g", "")));
  // Start the quote on a whole word.
  let q = m ? (m.index ? m[0].replace(/^\S*\s/, "") : m[0]) : "";
  // ...and end on one: drop a word cut off mid-way.
  if (m && /\w/.test(ad.text[(m.index ?? 0) + m[0].length] ?? "")) q = q.replace(/\s+\S*$/, "");
  return q ? `“${q.trim().replace(/[*#]/g, "")}”` : "";
};

/* ---------- the scorecard ---------- */
export const CRITERIA: Criterion[] = [
  {
    id: "title", group: "basics", label: "Clear job title, with the level", weight: 8,
    fix: "Use the title people search for, with the level in it (e.g. Senior UA Manager), and no 'rockstar' or 'ninja'.",
    check: (ad) => {
      if (!ad.title.trim()) return { status: "no", note: "We couldn't find a job title." };
      if (BUZZ.test(ad.title)) return { status: "no", note: `“${ad.title}” reads as a gimmick, not a role people search for.` };
      return LEVEL.test(ad.title)
        ? { status: "yes", note: `“${ad.title}”` }
        : { status: "partly", note: `“${ad.title}” doesn't say the level.` };
    },
  },
  {
    id: "where", group: "basics", label: "Location and remote policy, specific", weight: 8,
    fix: "Spell out the real working pattern in the ad itself, as many job boards only let you pick on-site or remote. If it's hybrid, say how many days in the office (and which); if remote, which countries and time zones; if on-site, where.",
    check: (ad) => {
      const place = /\b(location|based in|london|paris|berlin|helsinki|barcelona|amsterdam|dublin|istanbul|stockholm|uk|europe|emea|usa|remote|anywhere)\b/i.test(ad.text);
      const policy = /\b(remote|hybrid|on-?site|in[- ]office|office-based|work from home|wfh)\b/i.test(ad.text);
      const specific = /\b(on-?site|office-based|fully remote|remote[- ]first|100% remote)\b|\b(\d|one|two|three|four)\s*(days?|x)\s*(a|per|in the)?\s*(week|office)|time ?zones?|\bcet\b|\bgmt\b|\butc\b|within (the )?(uk|eu|europe)/i.test(ad.text);
      if (place && policy && specific) return { status: "yes", note: quote(ad, /(\d|one|two|three)\s*days?|time ?zones?|hybrid|remote/i) };
      if (place || policy) return { status: "partly", note: "There's a location or a remote/hybrid word, but not the detail (which days, which time zones)." };
      return { status: "no", note: "No location or remote policy." };
    },
  },
  {
    id: "pay", group: "basics", label: "Salary range published", weight: 12,
    fix: "Publish a salary range. It's the first thing most candidates look for, and ads without one get skipped.",
    check: (ad) => {
      if (RANGE.test(ad.text)) return { status: "yes", note: quote(ad, RANGE) };
      if (/\b(competitive|doe|depending on experience|attractive (salary|package)|market rate)\b/i.test(ad.text) && !MONEY.test(ad.text))
        return { status: "no", note: "“Competitive” isn't a number: candidates read it as 'probably low'." };
      if (MONEY.test(ad.text) && /salary|pay|compensation|package|per annum|base/i.test(ad.text)) return { status: "partly", note: `A single figure, not a range: ${quote(ad, MONEY)}` };
      return { status: "no", note: "No salary." };
    },
  },
  {
    id: "contract", group: "basics", label: "Contract type and hours", weight: 4,
    fix: "Say whether it's permanent, fixed-term or freelance, and full-time or part-time (with hours if part-time).",
    check: (ad) =>
      /\b(full[- ]?time|part[- ]?time|permanent|fixed[- ]term|contract(or)?\b|freelance|\d+\s*hours|fte)\b/i.test(ad.text)
        ? { status: "yes", note: quote(ad, /full[- ]?time|part[- ]?time|permanent|fixed[- ]term|freelance|contract/i) }
        : { status: "no", note: "Not stated." },
  },
  {
    id: "team", group: "basics", label: "Team composition", weight: 8,
    fix: "Say who they'll work with: who they report to, the size of the team, and the people around them.",
    check: (ad) => {
      const n = count(ad.text, [/\b(you('ll| will)? report|reporting (in)?to|(role|position) reports|reports? directly)\b/i, /team of \d+|\d+[- ]person team|\d+ (people|engineers|artists|designers|marketers)/i, /work(ing)? (closely )?(with|alongside)/i, /\b(squad|pod|studio of)\b/i]);
      return n >= 2 ? { status: "yes", note: quote(ad, /you('ll| will)? report|reporting (in)?to|team of \d+/i) || "Reporting line and team described." }
        : n === 1 ? { status: "partly", note: "Mentions the team, but not both who they report to and who's around them." }
        : { status: "no", note: "Nothing about the team." };
    },
  },
  {
    id: "outcome", group: "why", label: "The outcome: what this hire must achieve", weight: 15,
    fix: "Say what success looks like in the first 6–12 months: the problem this hire exists to solve. Responsibilities aren't outcomes.",
    check: (ad) => {
      const strong = /(first|within (the )?(first )?)\s*(30|60|90|\d+)\s*(days|months)|in your first (year|\d+)|success (looks like|in this role|means)|by the end of (your first|the year)|we('re| are) hiring (you )?to\b|this (role|hire) (exists|will)\b/i;
      if (strong.test(ad.text)) return { status: "yes", note: quote(ad, strong) };
      if (/\b(goal|objective|kpi|target|you will (grow|scale|deliver|achieve|double|launch))\b/i.test(ad.text))
        return { status: "partly", note: "There are goals in there, but no clear 'this is what you'll have achieved'." };
      return { status: "no", note: "Lists duties, but never says what the hire is meant to fix." };
    },
  },
  {
    id: "state", group: "why", label: "Where the company and game are now", weight: 8,
    fix: "Give the current state: live, soft launch or in development; stage or funding; scale (players, downloads) if you can share it.",
    check: (ad) => {
      const n = count(ad.text, [/soft[- ]launch|global launch|pre-?production|in development|live (game|ops)|liveops|launched/i, /series [abc]|seed|funded|raised|profitable|bootstrapped/i, /\d[\d.,]*\s?(m|million|bn|billion|k)?\s*(players|downloads|dau|mau|users|installs)/i, /founded in \d{4}|\d+ (employees|people)/i]);
      return n >= 2 ? { status: "yes", note: quote(ad, /soft[- ]launch|live|launched|series [abc]|\d[\d.,]*\s?(m|million)?\s*(players|downloads|users)/i) }
        : n === 1 ? { status: "partly", note: "Some context, but not enough to picture where things stand." }
        : { status: "no", note: "Nothing about the stage of the company or the game." };
    },
  },
  {
    id: "titles", group: "why", label: "The games they'd work on", weight: 7,
    fix: "Name the game(s) they'd work on, or say it's unannounced. Candidates want to know what they'd be building.",
    check: (ad) => {
      if (/\b(unannounced|under nda|confidential (project|title)|stealth)\b/i.test(ad.text)) return { status: "yes", note: "Unannounced project, said openly." };
      const named = /(games?|titles?|portfolio|franchise)\s+(like|such as|including|include)\s+[A-Z]|working on\s+[A-Z][\w']+|[Oo]ur (hit |flagship |new )?(game|title)s?,?\s+[A-Z][\w']+/;
      if (named.test(ad.text)) return { status: "yes", note: quote(ad, named) };
      return /\bour (games|titles|portfolio)\b/i.test(ad.text) ? { status: "partly", note: "Mentions 'our games' without saying which." } : { status: "no", note: "No games named." };
    },
  },
  {
    id: "musts", group: "discipline", label: "Five or six must-haves, not a wishlist", weight: 10,
    fix: "Cut the requirements to the 5 or 6 the outcome truly needs. Long lists put off strong people who don't tick every box.",
    check: (ad) => {
      const req = section(ad, /require|qualification|what you('ll)? (need|bring)|you (have|are)|about you|profile|skills|experience|who you are|must|love to hear|looking for|ideal candidate|you should|competenc|what it takes|you bring/i);
      const n = req?.length ?? 0;
      if (!req || !n) return { status: "partly", note: "We couldn't find a clear requirements list." };
      return n <= 6 ? { status: "yes", note: `${n} requirements.` } : n <= 9 ? { status: "partly", note: `${n} requirements: a few too many.` } : { status: "no", note: `${n} requirements: that's a wishlist.` };
    },
  },
  {
    id: "nice", group: "discipline", label: "Nice-to-haves kept separate", weight: 5,
    fix: "Move anything that isn't essential into a short 'nice to have' list, so people don't rule themselves out.",
    check: (ad) => {
      const nice = section(ad, /nice|bonus|plus|preferred|desirable|extra/i);
      if (nice?.length) return { status: "yes", note: `${nice.length} nice-to-haves, listed separately.` };
      return /\b(nice to have|is a plus|a bonus|preferred)\b/i.test(ad.text) ? { status: "partly", note: "Nice-to-haves are mixed in with the must-haves." } : { status: "no", note: "Everything reads as essential." };
    },
  },
  {
    id: "sane", group: "discipline", label: "No inflated or contradictory asks", weight: 5,
    fix: "Match the experience you ask for to the level and pay: no '10+ years' for a manager role, no lead duties in a mid-level title.",
    check: (ad) => {
      const years = [...ad.text.matchAll(/(\d{1,2})\+?\s*(?:-|to)?\s*(?:\d{1,2})?\s*years/gi)].map((m) => Number(m[1]));
      const max = years.length ? Math.max(...years) : 0;
      const junior = /\b(junior|associate|mid|graduate)\b/i.test(ad.title);
      if (max >= 8 && !/\b(head|director|vp|chief|principal)\b/i.test(ad.title)) return { status: "no", note: `Asks for ${max}+ years for a ${ad.title || "non-leadership"} role.` };
      if (junior && (max >= 4 || /\b(lead|manage) (a|the) team\b/i.test(ad.text))) return { status: "partly", note: "Senior asks in a junior-sounding role." };
      return { status: "yes", note: max ? `Asks for ${max} years, in line with the level.` : "Nothing inflated." };
    },
  },
  {
    id: "process", group: "experience", label: "The hiring process, stated", weight: 5,
    fix: "Say what happens after they apply: the stages, who they'll meet, and how long it takes.",
    check: (ad) => {
      const detail = /\b(\d|two|three|four)\s*(stages?|steps?|rounds?)|first call|intro(ductory)? call|final (interview|stage)|take[- ]home|test task|case study|we('ll| will) (reply|get back|respond) within/i;
      if (detail.test(ad.text)) return { status: "yes", note: quote(ad, detail) };
      return /\b(interview|hiring process|recruitment process)\b/i.test(ad.text) ? { status: "partly", note: "Mentions interviews, but not the steps or timing." } : { status: "no", note: "Nothing about what happens next." };
    },
  },
  {
    id: "read", group: "experience", label: "Readable length, clear way to apply", weight: 5,
    fix: "Aim for 300–800 words, with short sections and a clear way to apply.",
    check: (ad) => {
      const w = ad.text.split(/\s+/).filter(Boolean).length;
      const ok = w >= 250 && w <= 900;
      return ok ? { status: "yes", note: `${w} words.` } : { status: "partly", note: w < 250 ? `${w} words: too thin to judge the role.` : `${w} words: long enough that people skim past the important parts.` };
    },
  },
];

export const MAX = CRITERIA.reduce((a, c) => a + c.weight, 0); // 100

export type Result = {
  score: number;
  band: ReturnType<typeof bandFor>;
  items: (Check & { id: string; group: GroupId; label: string; weight: number; got: number; fix: string })[];
  groups: { id: GroupId; title: string; got: number; max: number }[];
  fixes: { label: string; fix: string; lost: number }[];
};

export function readAd(raw: string, title?: string): Ad {
  // Unfilled [placeholders] (from a draft built by "What am I hiring for?") count for nothing.
  const text = raw.replace(/\r/g, "").replace(/\u00a0/g, " ").replace(/\[[^\]\n]*\]/g, "").trim();
  const lines = text.split("\n").map((l) => l.trimEnd()).filter((l) => l.trim());
  const guess = title || (lines[0] || "").replace(/[*#]/g, "").trim().slice(0, 80);
  return { text, title: guess, lines, lower: text.toLowerCase() };
}

/** Build the result from an answer per criterion, however it was read. */
export function scoreFrom(checks: Record<string, Check>): Result {
  const items = CRITERIA.map((c) => {
    const r = checks[c.id] ?? { status: "no" as Status, note: "" };
    const got = r.status === "yes" ? c.weight : r.status === "partly" ? Math.round(c.weight / 2) : 0;
    return { ...r, id: c.id, group: c.group, label: c.label, weight: c.weight, got, fix: c.fix };
  });
  const score = Math.round((items.reduce((x, i) => x + i.got, 0) / MAX) * 100);
  const groups = GROUPS.map((g) => ({
    id: g.id,
    title: g.title,
    got: items.filter((i) => i.group === g.id).reduce((x, i) => x + i.got, 0),
    max: items.filter((i) => i.group === g.id).reduce((x, i) => x + i.weight, 0),
  }));
  const fixes = items
    .filter((i) => i.got < i.weight)
    .map((i) => ({ label: i.label, fix: i.fix, lost: i.weight - i.got }))
    .sort((x, y) => y.lost - x.lost)
    .slice(0, 3);
  return { score, band: bandFor(score), items, groups, fixes };
}

/** The rule-based reader (fallback when Claude isn't available). */
export function grade(raw: string, title?: string): Result {
  const ad = readAd(raw, title);
  return scoreFrom(Object.fromEntries(CRITERIA.map((c) => [c.id, c.check(ad)])));
}
