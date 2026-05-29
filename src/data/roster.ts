/**
 * Roster profiles — anonymised. Real identities are revealed only after a
 * brief/enquiry, never on the public site.
 *
 * Architected to be trivially swappable for a CMS or Airtable source later
 * (Andre uses Airtable). For now, a small typed array of dummy profiles so
 * the cosmetic build can demonstrate every filter axis without padding.
 * Real data is added by Andre post-cosmetic-build.
 */

export type Profile = {
  id: string;
  discipline: "ua" | "art";
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
    | "aso"
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
};

const LOC = {
  uk: { code: "uk", label: "uk · remote" },
  eu: { code: "eu", label: "eu · remote" },
  berlin: { code: "berlin", label: "berlin" },
  helsinki: { code: "helsinki", label: "helsinki" },
  telaviv: { code: "telaviv", label: "tel aviv" },
  istanbul: { code: "istanbul", label: "istanbul" },
  lisbon: { code: "lisbon", label: "lisbon" },
  warsaw: { code: "warsaw", label: "warsaw" },
} as const;

export const ROSTER: Profile[] = [
  {
    id: "ua-101",
    discipline: "ua",
    codename: "UA·101",
    role: "senior ua manager",
    background: "ex-supercell",
    location: LOC.uk,
    industries: ["games", "apps"],
    gamesCat: ["midcore", "casual"],
    appsCat: ["social"],
    genre: ["strategy", "puzzle"],
    monetisation: ["iap", "hybrid"],
    channels: ["meta", "google", "tiktok"],
    budget: 3,
    expertise: ["scaling", "skan"],
    dayRateLabel: "£600–750",
    dayRateBand: 2,
    rateMin: 600,
    available: true,
  },
  {
    id: "ua-102",
    discipline: "ua",
    codename: "UA·102",
    role: "lead ua manager",
    background: "ex-king",
    location: LOC.eu,
    industries: ["games"],
    gamesCat: ["casual", "hybridcasual"],
    appsCat: [],
    genre: ["puzzle", "simulation"],
    monetisation: ["iap"],
    channels: ["meta", "tiktok"],
    budget: 2,
    expertise: ["incrementality", "audience"],
    dayRateLabel: "£500–650",
    dayRateBand: 1,
    rateMin: 500,
    available: true,
  },
  {
    id: "ua-114",
    discipline: "ua",
    codename: "UA·114",
    role: "head of ua",
    background: "ex-rovio",
    location: LOC.helsinki,
    industries: ["games"],
    gamesCat: ["midcore", "hardcore"],
    appsCat: [],
    genre: ["rpg", "action"],
    monetisation: ["hybrid"],
    channels: ["meta", "google", "programmatic"],
    budget: 3,
    expertise: ["scaling", "liveops"],
    dayRateLabel: "£700–850",
    dayRateBand: 2,
    rateMin: 700,
    available: false,
  },
  {
    id: "ua-108",
    discipline: "ua",
    codename: "UA·108",
    role: "ua director",
    background: "ex-duolingo",
    location: LOC.telaviv,
    industries: ["apps"],
    gamesCat: [],
    appsCat: ["education", "social"],
    genre: [],
    monetisation: ["iap"],
    channels: ["meta", "asa", "google"],
    budget: 3,
    expertise: ["scaling", "reactivation"],
    dayRateLabel: "£700–850",
    dayRateBand: 2,
    rateMin: 700,
    available: true,
  },
  {
    id: "ua-130",
    discipline: "ua",
    codename: "UA·130",
    role: "growth lead",
    background: "ex-peak",
    location: LOC.uk,
    industries: ["games"],
    gamesCat: ["casual"],
    appsCat: [],
    genre: ["puzzle", "cards"],
    monetisation: ["iap", "iaa"],
    channels: ["meta", "tiktok", "influencer"],
    budget: 1,
    expertise: ["audience"],
    dayRateLabel: "£500–650",
    dayRateBand: 1,
    rateMin: 500,
    available: true,
  },
  {
    id: "ua-142",
    discipline: "ua",
    codename: "UA·142",
    role: "senior ua manager",
    background: "ex-calm",
    location: LOC.berlin,
    industries: ["apps"],
    gamesCat: [],
    appsCat: ["health", "lifestyle"],
    genre: [],
    monetisation: ["iap"],
    channels: ["meta", "google", "tiktok"],
    budget: 2,
    expertise: ["skan", "incrementality"],
    dayRateLabel: "£600–750",
    dayRateBand: 2,
    rateMin: 600,
    available: false,
  },
  {
    id: "ua-155",
    discipline: "ua",
    codename: "UA·155",
    role: "lead ua manager",
    background: "ex-wooga",
    location: LOC.istanbul,
    industries: ["games", "apps"],
    gamesCat: ["hypercasual", "casual"],
    appsCat: ["entertainment"],
    genre: ["action", "sports"],
    monetisation: ["iaa", "hybrid"],
    channels: ["meta", "google", "tiktok", "programmatic"],
    budget: 1,
    expertise: ["scaling", "audience"],
    dayRateLabel: "£450–550",
    dayRateBand: 0,
    rateMin: 450,
    available: true,
  },
  {
    id: "ua-168",
    discipline: "ua",
    codename: "UA·168",
    role: "growth lead",
    background: "ex-zynga",
    location: LOC.lisbon,
    industries: ["apps"],
    gamesCat: [],
    appsCat: ["finance", "shopping"],
    genre: [],
    monetisation: ["iap"],
    channels: ["meta", "google", "asa"],
    budget: 2,
    expertise: ["reactivation", "skan"],
    dayRateLabel: "£600–750",
    dayRateBand: 2,
    rateMin: 600,
    available: true,
  },
  {
    id: "art-201",
    discipline: "art",
    codename: "ART·201",
    role: "performance creative lead",
    background: "ex-calm",
    location: LOC.eu,
    industries: ["apps"],
    gamesCat: [],
    appsCat: ["health", "lifestyle"],
    genre: [],
    formats: ["video", "ugc", "static"],
    expertise: ["scaling"],
    dayRateLabel: "£500–650",
    dayRateBand: 1,
    rateMin: 500,
    available: true,
  },
  {
    id: "art-211",
    discipline: "art",
    codename: "ART·211",
    role: "senior motion designer",
    background: "ex-king",
    location: LOC.lisbon,
    industries: ["games"],
    gamesCat: ["casual", "midcore"],
    appsCat: [],
    genre: ["puzzle"],
    formats: ["motion", "video"],
    expertise: ["scaling"],
    dayRateLabel: "£450–550",
    dayRateBand: 0,
    rateMin: 450,
    available: true,
  },
  {
    id: "art-218",
    discipline: "art",
    codename: "ART·218",
    role: "art director",
    background: "ex-voodoo",
    location: LOC.warsaw,
    industries: ["games"],
    gamesCat: ["hypercasual", "hybridcasual"],
    appsCat: [],
    genre: ["action"],
    formats: ["static", "ugc", "playable"],
    expertise: ["scaling", "audience"],
    dayRateLabel: "£600–750",
    dayRateBand: 2,
    rateMin: 600,
    available: false,
  },
  {
    id: "art-224",
    discipline: "art",
    codename: "ART·224",
    role: "senior marketing artist",
    background: "ex-playrix",
    location: LOC.berlin,
    industries: ["games"],
    gamesCat: ["casual", "midcore"],
    appsCat: [],
    genre: ["puzzle", "simulation"],
    formats: ["video", "playable"],
    expertise: ["liveops"],
    dayRateLabel: "£500–650",
    dayRateBand: 1,
    rateMin: 500,
    available: true,
  },
  {
    id: "art-230",
    discipline: "art",
    codename: "ART·230",
    role: "lead creative",
    background: "ex-supercell",
    location: LOC.helsinki,
    industries: ["games", "apps"],
    gamesCat: ["midcore"],
    appsCat: ["entertainment"],
    genre: ["strategy"],
    formats: ["video", "motion", "ugc"],
    expertise: ["scaling", "incrementality"],
    dayRateLabel: "£700–850",
    dayRateBand: 2,
    rateMin: 700,
    available: false,
  },
  {
    id: "art-238",
    discipline: "art",
    codename: "ART·238",
    role: "performance creative lead",
    background: "ex-peak",
    location: LOC.uk,
    industries: ["apps"],
    gamesCat: [],
    appsCat: ["dating", "social"],
    genre: [],
    formats: ["video", "static", "ugc"],
    expertise: ["scaling", "audience"],
    dayRateLabel: "£500–650",
    dayRateBand: 1,
    rateMin: 500,
    available: true,
  },
];

export const BUDGET_LABELS = ["< £50k", "£50k–250k", "£250k–1m", "£1m+"] as const;
