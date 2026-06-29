/**
 * Roster profiles — anonymised. Real identities are revealed only after a
 * brief/enquiry, never on the public site.
 *
 * Architected to be trivially swappable for a CMS or Airtable source later
 * (Andre uses Airtable). The previous fake/demo dataset was removed per Andre
 * 2026-05-30 v5 — the lineup is now empty and waiting for real data. All
 * downstream UI (lineup grid, carousel, home stat counts) reads from this
 * array and falls back to empty states accordingly.
 */

export type Profile = {
  id: string;
  discipline: "ua" | "creative" | "aso";
  codename: string;
  role: string;
  background: string;
  location: { code: string; label: string };
  industries: ("games" | "apps")[];
  gamesCat: ("hypercasual" | "hybridcasual" | "casual" | "midcore" | "hardcore")[];
  appsCat: (
    | "health"
    | "dating"
    | "finance"
    | "social"
    | "education"
    | "entertainment"
    | "productivity"
    | "shopping"
    | "lifestyle"
    | "photo"
  )[];
  genre: (
    | "puzzle"
    | "rpg"
    | "strategy"
    | "casino"
    | "simulation"
    | "sports"
    | "action"
    | "cards"
  )[];
  monetisation?: ("iap" | "iaa" | "hybrid")[];
  channels?: (
    | "meta"
    | "google"
    | "tiktok"
    | "asa"
    | "programmatic"
    | "influencer"
  )[];
  budget?: 0 | 1 | 2 | 3;
  formats?: ("video" | "playable" | "static" | "ugc" | "motion")[];
  expertise: (
    | "incrementality"
    | "skan"
    | "scaling"
    | "liveops"
    | "reactivation"
    | "audience"
  )[];
  dayRateLabel: string;
  dayRateBand: 0 | 1 | 2;
  rateMin: number;
  available: boolean;
  summary?: string;

  /* Long-form profile content — lifted from the talent intake doc.
     All optional so older profiles keep rendering; the modal hides
     each section when its field is missing. */
  skills?: string[];
  experience?: string[];
  motivations?: string;
  recruiterNotes?: string[];
};

/**
 * Live roster. First profile seeded 2026-06-29 via the talent intake
 * doc (Andre fills, Claude commits). All downstream UI handles the
 * empty / single-profile state. Stats on the home page derive their
 * counts from this array.
 */
export const ROSTER: Profile[] = [
  {
    id: "cp-01",
    discipline: "creative",
    codename: "cp·01",
    role: "Production Lead",
    background:
      "10+ years bridging mobile games production and creative leadership. Currently Production Lead on a card-games title in active LiveOps and post-launch operations.",
    location: { code: "prague", label: "prague" },
    industries: ["games"],
    gamesCat: ["casual"],
    appsCat: [],
    genre: ["cards"],
    formats: ["video", "playable", "static", "ugc", "motion"],
    expertise: ["scaling", "liveops", "audience"],
    dayRateLabel: "£500 / day",
    dayRateBand: 1,
    rateMin: 500,
    available: true,
    summary:
      "Genuine production / creative hybrid. Owns release readiness, sprint planning, LiveOps and QA workflows on a live mobile card title. Previously ran high-volume creative production for multi-million-USD/mo campaigns across a top-tier studio's portfolio, scaled a marketing-production org to 25 people, and supported up to $1M/mo ad spend at positive ROI/LTV. Multiple App Growth Awards nominations.",
    skills: [
      "Mobile Game Production",
      "Production Management",
      "LiveOps Coordination",
      "Release Management",
      "Cross-functional Delivery",
      "Roadmap Execution",
      "Creative Production Leadership",
      "Team & Vendor Management",
      "Jira / Confluence / Asana",
      "ASO (AppTweak / Sensor Tower)",
      "Stakeholder Management",
      "Process Improvement",
    ],
    experience: [
      "10+ years across marketing and production in mobile games and creative production, with significant P&L, budgeting, and forecasting experience at both project and whole-business level.",
      "Currently Production Lead at a mobile card games studio, where he took a flagship card title through global release, post-launch operations, and ongoing LiveOps. Owns production planning, Jira workflows, sprint priorities, release readiness, and risk escalation across product, design, art, engineering, QA, marketing, ASO, and support. Also contributes to roadmap and LiveOps planning for a second card title.",
      "Previously ~3 years at a mobile UA/creative agency as senior strategic and operational lead for major mobile-gaming accounts (including a top-tier free-to-play studio whose full title portfolio he supported), running high-volume creative production for multi-million-USD/month campaigns and growing account capacity/team profitability by ~450%. Led teams to multiple App Growth Awards nominations.",
      "Earlier, as a senior marketing/production lead at a mobile games studio (later acquired by a major ad-tech/mediation company), led creative and marketing production through the overhaul of the studio's flagship title and a second release. Scaled marketing production to support up to $1M/month in ad spend at positive ROI/LTV, and grew the internal creative team to 25.",
      "Bridges creative and data-driven decision making, keeps art-team motivation and quality high while holding to data-informed strategy. Builds comprehensive 'bibles' for marketing, art, and LiveOps as data-informed knowledge repositories.",
      "Works within structured experimental frameworks. Production foundation began in national broadcast promo production before moving into mobile games. Earlier career spanned film, TV, and advertising across central Europe in Producer and Director roles, including high-profile advertising and music video projects; ran a small production company servicing clients including a global technology company, a consumer brand, and a mobile games studio.",
    ],
    motivations:
      "Primary motivators are new challenges and the chance to grow teams and projects. Sees no two projects as alike, each one requiring new skills and information, and treats that continual learning as how he grows and gains seniority.",
    recruiterNotes: [
      "Genuine production/creative hybrid. The bulk of his earlier leadership sat on the marketing and creative-production side, alongside more recent direct production-lead experience owning release, LiveOps, sprint and QA workflows on a live title.",
      "Real strength is cohesion across creative and data: held creative consistency across a top-tier studio's full title portfolio for several years and has repeatedly turned performance and audience insight into clear production priorities. Strongly process- and documentation-oriented.",
    ],
  },
];

export const BUDGET_LABELS = ["< £50k", "£50k–250k", "£250k–1m", "£1m+"] as const;
