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
    role: "Lead Growth Manager",
    background:
      "6+ years in mobile games user acquisition, focused on hyper and hybrid casual. Currently Lead Growth Manager at a hyper/hybrid casual publisher; 1 month notice.",
    location: { code: "remote", label: "remote" },
    industries: ["games"],
    gamesCat: ["hypercasual", "hybridcasual"],
    appsCat: [],
    genre: [],
    monetisation: ["iaa", "hybrid"],
    channels: ["meta", "google", "tiktok", "programmatic"],
    budget: 3,
    expertise: ["scaling", "audience"],
    dayRateLabel: "£550 / day",
    dayRateBand: 1,
    rateMin: 550,
    salaryAnnualLabel: "£62,000 / year",
    salaryAnnual: 62000,
    available: false,
    availableFor: ["contract", "permanent"],
    summary:
      "Growth manager with a strong internal-promotion story: UA Executive to Lead Growth Manager at the same publisher in ~4 years. Now owns growth across the publisher's full live portfolio, steering the team to spend and ROAS targets across all major UA networks with up to ~$2M/month in spend. Standout: native Mandarin plus a Nordic language and repeated ownership of China growth alongside Western channels.",
    skills: [
      "User Acquisition",
      "Growth Management",
      "Hyper / Hybrid Casual",
      "IAA & Hybrid Monetisation",
      "CPI / CPE / AdROAS / HybridROAS",
      "Rewarded Campaigns",
      "Creative Testing",
      "Portfolio Management",
      "Team Mentoring",
      "Google / Meta / TikTok",
      "AppLovin / IronSource / Unity / Mintegral",
      "China UA",
    ],
    experience: [
      "6+ years (since 2019) in mobile games user acquisition and growth, focused on hyper and hybrid casual, with a strong internal-promotion record (UA Executive up to Lead Growth Manager at the same publisher).",
      "Currently Lead Growth Manager at a hyper/hybrid casual mobile games publisher, responsible for growth across the entire live portfolio (a mix of IAA and hybrid-monetised titles). Steers the growth team to spend and ROAS targets across all major UA networks, owns the publisher's China growth effort, and works closely with creative, product, and data. Manages up to ~$2M/month in UA spend and grew FY spend ~20% while holding performance through a goal rework. Mentors and tailors development plans for each team member.",
      "As Senior Growth Manager, ran a 5-to-6 title hyper/hybrid casual portfolio end to end (scaling live games, launching and testing new titles, ongoing UA health checks), drove China growth insight for the publishing team, established new hybrid-casual UA methodologies, and managed up to ~$500K/month spend before promotion to Lead.",
      "Earlier, as UA Executive, ran 2 to 3 IAA titles with continuous network and campaign-type testing, delivering 4 launches and a promotion in year one; top title reached 130M+ downloads.",
      "Before games, held an app-store growth and operations role at a major technology group (store operations, performance-marketing tracking, data analysis and creative optimisation for advertising clients), and began in an associate UA and publishing role at a hypercasual publisher, where he standardised the UA testing pipeline and was named company MVP.",
      "Trilingual with an international business education; deep hands-on UA across Google, Meta, TikTok, AppLovin, IronSource, Unity, Mintegral, and rewarded channels, with particular strength bridging Western and Chinese markets.",
    ],
    motivations:
      "Spends both halves of the year in different countries and is looking for remote roles that push him out of his comfort zone.",
    recruiterNotes: [
      "Provisional read from CV review only, no direct conversation yet. Strong internal-progression signal: moved from UA Executive to Lead Growth Manager at the same publisher in roughly four years, with promotions explicitly tied to results. Reads as someone studios retain and keep betting on.",
      "Cross-market profile is the standout: native Mandarin plus a Nordic language and an international business background, with repeated ownership of China growth alongside Western networks. A rare, useful combination for any publisher with China ambitions.",
    ],
  },
];

export const BUDGET_LABELS = ["< £50k", "£50k–250k", "£250k–1m", "£1m+"] as const;
