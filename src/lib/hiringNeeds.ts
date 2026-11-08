/**
 * "What am I hiring for?" (MOCKUP, Andre 2026-11-08). Step one in the chain
 * of free tools: work out the hire from first principles before writing an
 * ad. You only hire because something needs doing that nobody in the team
 * can do (or has room to do) at the volume or quality needed. The answers
 * produce a role brief, e.g. "a 20-hour-a-week concept art contractor for
 * 3–6 months" or "a permanent Senior UA Manager focused on IAP mid-core
 * RPGs", which can then become a job ad that scores well first time.
 */
export type Skill = { id: string; label: string; area: Area; title: string; musts: string[] };
export type Area = "growth" | "art" | "product" | "eng";

export const AREAS: { id: Area; label: string }[] = [
  { id: "growth", label: "Growth and marketing" },
  { id: "art", label: "Art and creative" },
  { id: "product", label: "Product and design" },
  { id: "eng", label: "Engineering" },
];

export const SKILLS: Skill[] = [
  { id: "ua", area: "growth", label: "Paid user acquisition", title: "User Acquisition Manager", musts: ["Has run paid UA on Meta, Google and TikTok at your budget level", "Optimises to ROAS and LTV, not installs"] },
  { id: "creative", area: "growth", label: "Creative strategy", title: "Creative Strategist", musts: ["Has built a creative testing pipeline for mobile ads", "Turns data into briefs artists can act on"] },
  { id: "admon", area: "growth", label: "Ad monetisation", title: "Ad Monetisation Manager", musts: ["Has managed mediation and waterfalls (AppLovin MAX, ironSource or AdMob)", "Balances ad revenue against retention"] },
  { id: "aso", area: "growth", label: "App store optimisation", title: "ASO Specialist", musts: ["Has run store listing tests on both stores", "Knows keyword and creative ASO"] },
  { id: "data", area: "growth", label: "Analytics and data", title: "Data Analyst", musts: ["SQL and a BI tool, used on game or app data", "Can turn a question into an answer the team acts on"] },
  { id: "liveops", area: "growth", label: "LiveOps and CRM", title: "LiveOps Manager", musts: ["Has planned and run live events on a live mobile game", "Reads retention and engagement data"] },
  { id: "concept", area: "art", label: "Concept art", title: "Concept Artist", musts: ["A portfolio in your game's style", "Works fast from rough to final"] },
  { id: "ui", area: "art", label: "2D and UI art", title: "UI Artist", musts: ["Has shipped UI for a mobile game", "Designs for small screens and touch"] },
  { id: "3d", area: "art", label: "3D art", title: "3D Artist", musts: ["Mobile-optimised 3D assets in your style", "Knows the pipeline into Unity or Unreal"] },
  { id: "anim", area: "art", label: "Animation and VFX", title: "Animator", musts: ["Has animated for a shipped mobile game", "Works within mobile performance budgets"] },
  { id: "mktart", area: "art", label: "Marketing art and video", title: "Marketing Artist", musts: ["Has made ad creatives that scaled", "Fast iteration on video and static ads"] },
  { id: "design", area: "product", label: "Game design", title: "Game Designer", musts: ["Has shipped features on a live mobile game", "Designs from player data, not just instinct"] },
  { id: "economy", area: "product", label: "Economy and monetisation design", title: "Economy Designer", musts: ["Has balanced an economy on a live free-to-play game", "Models economies in spreadsheets before building"] },
  { id: "level", area: "product", label: "Level design", title: "Level Designer", musts: ["Has built levels at volume for a live game", "Tunes difficulty from data"] },
  { id: "pm", area: "product", label: "Product management", title: "Product Manager", musts: ["Has owned a roadmap for a live mobile game or app", "Runs A/B tests and acts on the results"] },
  { id: "unity", area: "eng", label: "Unity development", title: "Unity Developer", musts: ["Has shipped a mobile game in Unity", "Writes performant C# for low-end devices"] },
  { id: "unreal", area: "eng", label: "Unreal development", title: "Unreal Developer", musts: ["Has shipped in Unreal on mobile", "Blueprint and C++"] },
  { id: "backend", area: "eng", label: "Backend and live services", title: "Backend Engineer", musts: ["Has built backend services for a live game", "Scales for launch spikes"] },
];

export const PROBLEMS = [
  { id: "grow", label: "We need more players, profitably", skills: ["ua", "creative", "aso"] },
  { id: "money", label: "We need to earn more from the players we have", skills: ["admon", "economy", "liveops"] },
  { id: "retain", label: "Players aren't sticking around", skills: ["design", "liveops", "data"] },
  { id: "content", label: "We can't make content fast enough", skills: ["concept", "3d", "level"] },
  { id: "launch", label: "We're getting a new game to launch", skills: ["design", "unity", "pm"] },
  { id: "ads", label: "Our ad creatives aren't working", skills: ["creative", "mktart"] },
  { id: "other", label: "Something else", skills: [] },
];

export type Have = "none" | "busy" | "quality" | "yes"; // nobody / at capacity / not at the level needed / covered
export const HAVE: { id: Have; label: string }[] = [
  { id: "none", label: "Nobody has this" },
  { id: "busy", label: "Someone does, but they're at capacity" },
  { id: "quality", label: "Someone does, but not at the level we need" },
  { id: "yes", label: "Yes, and they have room for it" },
];

export const HOURS = [
  { id: 10, label: "Under 10 hours a week" },
  { id: 20, label: "About 20 hours a week" },
  { id: 40, label: "A full-time week" },
];
export const LENGTH = [
  { id: "weeks", label: "A few weeks", months: 1 },
  { id: "3-6", label: "3 to 6 months", months: 6 },
  { id: "6-12", label: "6 to 12 months", months: 12 },
  { id: "ongoing", label: "Ongoing", months: 99 },
];
export const MODELS = ["In-app purchases", "Ads", "Hybrid (IAP and ads)", "Subscriptions", "Premium"];
export const GENRES = ["Casual", "Hybrid-casual", "Puzzle", "Mid-core", "RPG", "Strategy", "Casino-style", "Sports", "Simulation", "An app, not a game"];

export type Answers = {
  problem: string;
  problemText: string;
  outcome: string;
  by: string;
  skills: string[];
  have: Record<string, Have>;
  hours: number;
  length: string;
  model: string;
  genres: string[];
};

export type Brief =
  | { kind: "none"; reason: string }
  | {
      kind: "hire";
      sentence: string;
      title: string;
      level: string;
      type: string;
      hours: string;
      length: string;
      focus: string;
      outcome: string;
      musts: string[];
      why: string;
      more: string[]; // further gaps, for a second hire later
    };

const genreLine = (a: Answers) => {
  const g = a.genres.filter((x) => x !== "An app, not a game").map((x) => (x === "RPG" ? x : x.toLowerCase()));
  const what = a.genres.includes("An app, not a game") && !g.length ? "apps" : `${g.join(" / ") || "mobile"} games`;
  const model = { "In-app purchases": "IAP", Ads: "ad-monetised", "Hybrid (IAP and ads)": "hybrid-monetised", Subscriptions: "subscription", Premium: "premium" }[a.model] || "";
  return `${model ? `${model} ` : ""}${what.replace(" / ", " ")}`.trim();
};

export function brief(a: Answers): Brief {
  const gaps = a.skills.filter((s) => (a.have[s] ?? "none") !== "yes");
  if (!a.skills.length) return { kind: "none", reason: "Pick the skills the work needs, and we'll work out the hire." };
  if (!gaps.length)
    return {
      kind: "none",
      reason: "Everything this needs already exists in your team, with room to do it. You may not need to hire: this could be a priorities problem, not a people problem. Worth checking what's crowding it out first.",
    };

  const sk = SKILLS.find((s) => s.id === gaps[0])!;
  const have = a.have[sk.id] ?? "none";
  const len = LENGTH.find((l) => l.id === a.length) ?? LENGTH[1];
  const fullTime = a.hours >= 40;
  const permanent = fullTime && len.months >= 12;
  const level = have === "busy" ? "Mid-level" : "Senior";
  const type = permanent ? "Permanent" : "Contractor";
  const hoursTxt = a.hours >= 40 ? "full-time" : `${a.hours} hours a week`;
  const lenTxt = permanent ? "" : len.label.toLowerCase();
  const focus = genreLine(a);
  const title = `${level === "Senior" ? "Senior " : ""}${sk.title}`;

  const sentence = permanent
    ? `A permanent ${title}, focused on ${focus}${a.outcome ? `, hired to ${a.outcome.replace(/^to\s+/i, "").replace(/\.$/, "")}` : ""}.`
    : `A ${hoursTxt === "full-time" ? "full-time" : hoursTxt} ${sk.title.toLowerCase()} contractor for ${lenTxt}, experienced in ${focus}${a.outcome ? `, to ${a.outcome.replace(/^to\s+/i, "").replace(/\.$/, "")}` : ""}.`;

  const why =
    have === "none"
      ? "Nobody in the team has this skill, so you need someone who can own it from day one, which means senior."
      : have === "quality"
        ? "You have the skill, but not at the level the outcome needs, so this hire has to raise the bar: senior."
        : "You have the skill but not the capacity, so someone mid-level can pick up the volume with your team's guidance.";

  return {
    kind: "hire",
    sentence,
    title: permanent ? title : `${sk.title} (contract)`,
    level,
    type,
    hours: hoursTxt === "full-time" ? "Full-time" : hoursTxt,
    length: permanent ? "Ongoing" : len.label,
    focus,
    outcome: a.outcome,
    musts: [...sk.musts, `Experience with ${focus}`, ...(a.outcome ? [`Has done something like this before: ${a.outcome.replace(/\.$/, "")}`] : [])].slice(0, 5),
    why,
    more: gaps.slice(1).map((g) => SKILLS.find((s) => s.id === g)!.title),
  };
}

/** A draft job ad from the brief, with the gaps marked for them to fill (feeds the grading tool). */
export function draftAd(b: Extract<Brief, { kind: "hire" }>, a: Answers) {
  return [
    b.title,
    `[Location] · [Remote / hybrid / on-site, and which days or time zones]`,
    `Salary: [£ range]`,
    `${b.type === "Permanent" ? "Permanent, full-time" : `Contract, ${b.hours}, ${b.length.toLowerCase()}`}`,
    "",
    "**Why we're hiring**",
    b.outcome
      ? `We're hiring you to ${b.outcome.replace(/^to\s+/i, "").replace(/\.$/, "")}${a.by ? ` by ${a.by}` : ""}. In your first 90 days, success looks like [the first milestone].`
      : "In your first 90 days, success looks like [the first milestone].",
    "",
    "**Where we are now**",
    `[Your studio: stage, team size, funding.] We make ${b.focus}. [Is the game live, in soft launch or in development? Share scale if you can: players, downloads.]`,
    "",
    "**The team**",
    "You'll report to [name, role] and work with [who: team size and roles].",
    "",
    "**What you'll need**",
    ...b.musts.map((m) => `- ${m}`),
    "",
    "**Nice to have**",
    "- [One or two things that would help, but aren't essential]",
    "",
    "**How we hire**",
    "Three stages: a 30-minute intro call, [a practical task or case study], and a final interview with [who]. We'll get back to you within [X] working days.",
  ].join("\n");
}

/** Keyword fallback for the skills question (no API key, or the call failed). */
const KEYWORDS: Record<string, RegExp> = {
  ua: /\b(ua|user acquisition|installs?|cpi|roas|paid|ad spend|scale spend|meta|tiktok|google ads|players?)\b/i,
  creative: /\b(creatives?|ad (videos?|concepts?)|hooks?|creative testing)\b/i,
  admon: /\b(ad revenue|ad monetis|ad monetiz|mediation|waterfall|arpdau|ads? revenue)\b/i,
  aso: /\b(aso|store (page|listing)|app store|organic|keywords?|ratings?)\b/i,
  data: /\b(data|analytics|dashboards?|sql|tracking|attribution|insights?)\b/i,
  liveops: /\b(liveops|live ops|events?|crm|push|retention|engagement|churn)\b/i,
  concept: /\b(concept art|concepts?|art direction|visual style)\b/i,
  ui: /\b(ui|ux|interface|menus?|hud)\b/i,
  "3d": /\b(3d|models?|modell?ing|assets?)\b/i,
  anim: /\b(animation|animator|vfx|effects)\b/i,
  mktart: /\b(marketing art|ad art|store art|screenshots|trailers?)\b/i,
  design: /\b(game design|features?|core loop|gameplay|meta game|fun)\b/i,
  economy: /\b(economy|monetis|monetiz|iap|in-app purchases?|pricing|offers?|arppu|ltv)\b/i,
  level: /\b(levels?|level design|puzzles?|content)\b/i,
  pm: /\b(roadmap|product|priorit|a\/b|ab tests?|launch)\b/i,
  unity: /\b(unity|c#|client|build|performance|crash)\b/i,
  unreal: /\b(unreal|blueprints?|c\+\+)\b/i,
  backend: /\b(backend|back-end|server|live services|multiplayer|scal(e|ing) (the )?servers?)\b/i,
};
export function guessSkills(text: string) {
  const hits = Object.entries(KEYWORDS)
    .map(([id, re]) => ({ id, n: (text.match(new RegExp(re.source, "gi")) || []).length }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, 3)
    .map((x) => x.id);
  return hits;
}
