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
  /* Permanent-salary equivalent. Many studios brief us on contract
     terms but want the option to flip to perm later, so the salary
     they'd need to pay needs to be on the card as well as the rate. */
  salaryAnnualLabel?: string;
  salaryAnnual?: number;

  /* Independent of `available`. `available` is "ready to start now";
     `availableFor` says which engagement types they're open to. A
     candidate can be available now but only for contract, or in 3
     months for permanent, etc. */
  available: boolean;
  availableFor: ("contract" | "permanent")[];

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
    role: "Creative Production Lead",
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
    salaryAnnualLabel: "£60,000 / year",
    salaryAnnual: 60000,
    available: true,
    availableFor: ["contract", "permanent"],
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
  {
    id: "ua-01",
    discipline: "ua",
    codename: "ua·01",
    role: "Head of UA & Growth",
    background:
      "15+ years in growth and performance marketing across mobile games, apps, and AI-driven products. Currently Head of UA & Growth at an AI venture studio (remote contract).",
    location: { code: "uk", label: "uk" },
    industries: ["games", "apps"],
    gamesCat: ["casual", "midcore"],
    appsCat: ["health", "lifestyle", "entertainment"],
    genre: ["casino", "simulation"],
    monetisation: ["iap", "hybrid"],
    channels: ["meta", "google", "tiktok", "programmatic", "influencer"],
    budget: 3,
    expertise: ["scaling", "audience", "reactivation", "skan"],
    dayRateLabel: "£800 / day",
    dayRateBand: 2,
    rateMin: 800,
    salaryAnnualLabel: "£80,000 - £120,000 / year",
    salaryAnnual: 100000,
    available: true,
    availableFor: ["permanent", "contract"],
    summary:
      "Growth and performance-marketing leader with 15+ years scaling consumer products across mobile games, apps, social platforms, and AI. Has managed up to $10M/month in UA spend and led teams of up to 12, with full ownership of ROAS, CAC, LTV, and payback. 5+ years in games specifically, plus recent lean into pLTV modelling, cohort forecasting, AI-assisted creative and n8n workflow automation. Ideally looking to get back into gaming.",
    skills: [
      "Growth Marketing Strategy",
      "Performance Marketing",
      "Full-Funnel Optimisation",
      "pLTV Forecasting & Cohort Modelling",
      "Creative Strategy & Testing",
      "ASO",
      "Influencer / CTV",
      "Retention & Unit Economics",
      "Team Leadership",
      "Product & Marketing Analytics",
      "n8n AI Workflow Automation",
      "Meta / Google / TikTok / DSPs",
    ],
    experience: [
      "15+ years in growth and performance marketing, scaling consumer products across mobile games, apps, social platforms, and more recently AI-driven products. Has managed up to $10M/month in acquisition spend and led teams of up to 12, with full ownership of ROAS, CAC, LTV, and payback.",
      "Currently Head of UA and Growth (remote contract) at a venture studio for AI startups, owning go-to-market and unit-economics guardrails for an AI health app (subscription MRR, CAC, payback, LTV, ROAS) and building an n8n-based AI creative operating system shipping up to 100 assets a day at a 32% win rate.",
      "Previously Head of Mobile Growth at a major Russian tech and telecom group, where she doubled the travel product's hotel bookings month over month for six consecutive months, lifted daily orders ~10% via web-to-app conversion work, led a team of 5, and 4x'd creative velocity using AI.",
      "Founding Growth Lead (contract) at an early-stage AI fashion and wardrobe app: acquired the first 50K users via Meta and TikTok at 36% D3 retention, raised app-store conversion 65% through ASO, and fed UA insight into the product roadmap (onboarding conversion +25%).",
      "5+ years in games. Games track record runs deep: UA Lead during the soft launch of a casual social title (D5 retention +30%, with findings shaping narrative and features); Lead UA at a UK studio behind a long-running 3D social-world mobile game (scaled IAP across Meta, Google, TikTok, and DSPs in Tier-1, LATAM, and APAC, migrated the stack to a new MMP and LTV model, managed a multi-million annual budget); plus earlier UA manager roles at a social casino publisher and a UK mobile games studio.",
      "Notable cross-domain wins: a zero-production-cost TikTok strategy scaling a Gen Z game across 18 countries; a UGC video app taken to a Top 3 Google Play ranking with 3x active users in 3 months; CAC cut 21% on a UGC platform via media-mix restructuring; and profitable spend grown 10x on social casino via new channels and AEO.",
    ],
    motivations:
      "Joining a great team with a solid product is the most important thing for her.",
    recruiterNotes: [
      "Provisional read from CV review only, no direct conversation yet. Not just channel and ROAS but pLTV modelling, cohort forecasting, unit economics, and retention. Suits a Head of Growth brief more than a pure UA seat.",
      "Heavy recent lean into AI-assisted creative and workflow automation.",
      "Both games and apps experience, but ideally looking to get back into gaming.",
    ],
  },
];

export const BUDGET_LABELS = ["< £50k", "£50k–250k", "£250k–1m", "£1m+"] as const;
