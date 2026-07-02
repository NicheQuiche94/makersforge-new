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
  /* Optional upper bound for day rate. When present and different
     from rateMin, the display renders the day rate as a range
     (e.g. £800 to £1,000 / day). Absent = single value. */
  rateMax?: number;
  /* Permanent-salary equivalent. Many studios brief us on contract
     terms but want the option to flip to perm later, so the salary
     they'd need to pay needs to be on the card as well as the rate. */
  salaryAnnualLabel?: string;
  salaryAnnual?: number;
  /* Optional upper bound for annual salary. Same pattern as
     rateMax — when present, display renders as a range. */
  salaryAnnualMax?: number;

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
    role: "Head of Growth",
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
    salaryAnnualLabel: "£80,000 to £120,000 / year",
    salaryAnnual: 80000,
    salaryAnnualMax: 120000,
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
  {
    id: "ua-02",
    discipline: "ua",
    codename: "ua·02",
    role: "Lead Growth Manager",
    background:
      "6+ years in mobile games user acquisition, focused on hyper and hybrid casual. Currently Lead Growth Manager at a hyper/hybrid casual publisher; 1 month notice.",
    location: { code: "eu", label: "eu · remote" },
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
    available: true,
    availableFor: ["contract", "permanent"],
    summary:
      "Growth manager with a strong internal-promotion story: UA Executive to Lead Growth Manager at the same publisher in ~4 years. Now owns growth across the publisher's full live portfolio, steering the team to spend and ROAS targets across all major UA networks with up to $2.5M/month in spend. Trilingual with an international business education.",
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
      "Currently Lead Growth Manager at a hyper/hybrid casual mobile games publisher, responsible for growth across the entire live portfolio (a mix of IAA and hybrid-monetised titles). Steers the growth team to spend and ROAS targets across all major UA networks, owns the publisher's global growth effort, and works closely with creative, product, and data. Manages up to $2.5M/month in UA spend and grew yearly spend ~20% while holding performance through a goal rework. Mentors and tailors development plans for each team member.",
      "As Senior Growth Manager, ran a 5-to-6 title hyper/hybrid casual portfolio end to end (scaling live games, launching and testing new titles, ongoing UA health checks), established new hybrid-casual UA methodologies, and managed up to ~$500K/month spend before promotion to Lead.",
      "Earlier, as UA Executive, ran 2 to 3 IAA titles with continuous network and campaign-type testing, delivering 4 launches and a promotion in year one; top title reached 130M+ downloads.",
      "Before games, held an app-store growth and operations role at a major technology group (store operations, performance-marketing tracking, data analysis and creative optimisation for advertising clients), and began in an associate UA and publishing role at a hypercasual publisher, where he standardised the UA testing pipeline and was named company MVP.",
      "Trilingual with an international business education; deep hands-on UA across Google, Meta, TikTok, AppLovin, IronSource, Unity, Mintegral, and rewarded channels.",
    ],
    motivations:
      "Spends both halves of the year in different countries looking for remote roles.",
    recruiterNotes: [
      "Strong internal-progression signal: moved from UA Executive to Lead Growth Manager at the same publisher in roughly four years, with promotions explicitly tied to results. Reads as someone studios retain and keep betting on.",
      "Cross-market profile is the standout: native Mandarin plus a Nordic language and an international business background.",
    ],
  },
  {
    id: "ua-05",
    discipline: "ua",
    codename: "ua·05",
    role: "Head of UA",
    background:
      "8+ years in user acquisition across mobile games and subscription apps, 6+ of them as Head of UA. Currently Head of UA at a US subscription apps company; available now.",
    location: { code: "eu", label: "eu · remote" },
    industries: ["games", "apps"],
    gamesCat: ["casual"],
    appsCat: ["lifestyle", "productivity"],
    genre: ["puzzle"],
    monetisation: ["iap", "iaa", "hybrid"],
    channels: ["meta", "google", "tiktok", "programmatic"],
    budget: 3,
    expertise: ["scaling", "audience", "reactivation"],
    dayRateLabel: "£900 / day",
    dayRateBand: 2,
    rateMin: 900,
    salaryAnnualLabel: "€120,000 to €180,000 / year",
    salaryAnnual: 100000,
    salaryAnnualMax: 150000,
    available: true,
    availableFor: ["contract", "permanent"],
    summary:
      "Serious scaling operator with a hands-on core. Took a studio's UA from ~$200K to ~$3.5M/month at 5x profit growth. Launched a match-3 title from zero to ~$3.5M/month. Repeatedly rebuilt both monetisation and creative pipelines across mobile games and subscription apps. Stays on the tools even as Head of UA. Sits with PMs, runs creative strategy, owns the testing framework.",
    skills: [
      "User Acquisition Strategy",
      "Mobile Games & Subscription Apps UA",
      "Web2App / Web2Web",
      "Team Leadership (UA / Analytics / Creative)",
      "Creative Strategy & Production Scaling",
      "Monetisation (IAA / IAP)",
      "Meta / Google / AppLovin / Unity / Mintegral / Moloco / ironSource / TikTok",
      "AppsFlyer / Adjust / BI",
      "Predictive Analytics & Forecasting",
      "Budgets to $3.5M/month",
    ],
    experience: [
      "8+ years in user acquisition across mobile games and apps, 6+ of them as Head of UA, scaling teams from 3 up to 15 specialists spanning lead UA managers, analytics, and creative. Hands-on throughout: builds strategy with the team and still runs campaigns herself even at Head level, and owns the outcome.",
      "Most recently Head of UA at a US subscription apps company, leading UA and creative for a long-running (5+ year) flagship subscription app. Built reporting and forecasting, lifted company profitability ~1.5x, scaled the flagship to #1 in its category despite a mature lifecycle, launched Web2Web and Web2App acquisition, held every R&D project at 100%+ ROI, and set a new all-time revenue record. Also runs her own B2B company on the side.",
      "Before that, Head of UA at a French apps-and-games company: ran UA, analytics, and creative with acquisition audits and scale-readiness planning, established reporting and forecasting, lifted profitability ~4x and hit the annual revenue plan in year one, and scaled 2 utility apps and 3 games by 5x+.",
      "Earlier, Head of UA at a casual mobile games studio, where she built the UA org from ~4 to ~15 people (UA managers, team leads, analytics, and creative producers). Joined at ~$200K/month spend, reworked monetisation from pure ad/IAA into IAA+IAP, overhauled UA strategy, and scaled to ~$3.5M/month with 5x+ profit growth. Tested 20+ networks, worked with Meta on IAP ROAS optimisation, launched and owned a new match-3 title end to end (from zero to ~$3.5M/month), built the UA analytics, BI, and predictive-forecasting function, and set up a freelance motion-design platform that lifted creative output from ~20 to ~100 pieces a week. Helped the company into the top 10 by revenue in its market.",
      "Foundations at a UA agency (progressed from junior to team lead in 6 months across all the major networks) and earlier UA roles at casual mobile studios; bachelor's in management.",
      "Works extremely close to product and creative: sits with PMs for the full product picture, and runs creative strategy hands-on, sharing metrics, scoping creative tasks, and owning the testing framework. Deep channel coverage across Meta, Google, AppLovin, Unity, Mintegral, Moloco, ironSource, and TikTok, with AppsFlyer, Adjust, and strong BI and predictive analytics.",
    ],
    motivations:
      "Wants to move back into gaming, ideally toward larger and well-resourced companies. Open to any monetisation model, with a lean toward casual and IAP-driven games. Prefers remote. Biggest driver is great people and a good working environment.",
    recruiterNotes: [
      "Serious scaling operator with a hands-on core: took a studio's UA from ~$200K to ~$3.5M/month at 5x profit, launched a match-3 title from zero, and repeatedly rebuilt both monetisation (IAA into IAP) and creative pipelines. The through-line is that she stays on the tools, running campaigns herself as Head of UA, which suits a studio wanting a leader who still executes.",
      "Very complete across the UA stack: strategy, team building (up to 15 across UA, analytics, and creative), predictive BI and forecasting, and creative production at volume, with the freelance motion-design platform going 20 to 100 creatives a week as a standout. Comfortable across both games and subscription apps, and both in-house and agency.",
    ],
  },
  {
    id: "ua-04",
    discipline: "ua",
    codename: "ua·04",
    role: "Head of Growth",
    background:
      "Multi-disciplinary growth marketer combining UA, creative production, ASO, product marketing, and monetisation. Recent Head of Growth on an RPG launch; immediately available.",
    location: { code: "eu", label: "eu · remote" },
    industries: ["games"],
    gamesCat: ["casual", "midcore"],
    appsCat: [],
    genre: ["rpg", "simulation"],
    monetisation: ["iap", "hybrid"],
    channels: ["meta", "google", "tiktok"],
    expertise: ["audience", "reactivation"],
    dayRateLabel: "£500 / day",
    dayRateBand: 1,
    rateMin: 500,
    salaryAnnualLabel: "€60,000 to €65,000 / year",
    salaryAnnual: 51000,
    salaryAnnualMax: 55000,
    available: true,
    availableFor: ["permanent", "contract"],
    summary:
      "Multi-disciplinary growth marketer with a strong engineering and data combination. Owns UA end-to-end: creative production, ASO, monetisation design, A/B testing, and community building. Recent Head of Growth on an RPG launch hit ~$1 CPIs in Tier-1 GEOs, 15% D7 ROAS uplift from monetisation design, ~10% ASO conversion lift, and 3x community growth. Stays hands-on across the stack.",
    skills: [
      "User Acquisition (Organic + Paid)",
      "UA Creative Production",
      "Creative Testing & Iteration",
      "ASO",
      "Monetisation & IAP Design",
      "Product Marketing",
      "Data Analysis",
      "A/B Testing",
      "Community Building",
      "Customer Segmentation",
      "Go-to-Market",
    ],
    experience: [
      "Multi-disciplinary growth marketer with engineering, data, and research background combining growth, performance, and product marketing into one holistic approach; consistently hands-on in small, cross-functional teams.",
      "Most recently Head of Growth at a mobile games studio, owning soft and global launch and UA strategy for an RPG title: KPI-centric UA creative production and iteration (ROAS/CPI/CPE/retention), ASO lifting conversion ~10%, monetisation design driving a 15% D7 ROAS uplift, and A/B testing that reached ~$1 CPIs in Tier-1 GEOs on Android and iOS, plus 3x community growth. The role ended in a redundancy after the studio's funding fell through.",
      "Before that, a multi-year progression at a gaming company that began as a web gaming platform and moved into mobile: from Product Specialist and Product Marketing Manager (Mixpanel ownership, data-driven product reporting, tutorialisation, feature-project management, and helping build a 250k+ userbase) up to Growth Lead.",
      "As Growth Lead there, designed soft-launch and UA strategy for a dating and life-simulation mobile game, ran a weekly playtest-driven design loop, hit peak ASO conversion of 88% on Tier-1 iOS and sub-$1 CPIs, built a 1,500+ member playtesting community in 6 months, and managed a team of 6 (2x creative output and guided playtests).",
      "Earlier in that progression, as Growth & Product Marketing Manager, ran marketability testing, go-to-market (+20% organic lifetime users at launch), social strategy (20M+ impressions across paid and organic), and owned email marketing end to end.",
      "Strong data-and-creative combination: comfortable owning the analytics side and producing UA creative directly, running structured creative testing. Also runs personal growth and content projects, including a video-production channel and a gaming-events project grown 300% YoY on attendance.",
    ],
    motivations:
      "Core preference is UA and creative production, with product and monetisation/IAP design as genuinely enjoyable adjacent work. Wants small, multi-disciplinary teams where he can stay hands-on across UA, creative, ASO, product, and monetisation. Prefers to avoid casino products.",
    recruiterNotes: [
      "Rare mix of a rigorous science and data background with hands-on UA creative production, which shows up in the numbers ($1 CPIs, 88% ASO conversion, 15% D7 ROAS uplift). Strong fit where a studio wants one person to own UA end to end, creative through analytics.",
    ],
  },
];

export const BUDGET_LABELS = ["< £50k", "£50k–250k", "£250k–1m", "£1m+"] as const;
