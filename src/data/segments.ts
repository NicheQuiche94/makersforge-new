/**
 * Company-side "doors" (Andre 2026-10-23). The homepage's first screen asks
 * who you are — game studio, app company or talent — and the two company
 * doors land on their own page (/games, /apps) built from the same sections
 * as home, but with copy, roles and links that speak to that buyer. Talent
 * goes to the existing /talent page.
 *
 * Kept as data so the two pages stay structurally identical and only the
 * words differ.
 */

export type Cluster = { label: string; roles: string[] };

export type Segment = {
  slug: "games" | "apps";
  /** Enquire form pre-ticks this industry (?industry=). */
  industry: "games" | "apps";
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  headline: [string, string, string];
  lede: string;
  coverTitle: string;
  clusters: Cluster[];
  /** The placement logos are all game studios, so only games shows them. */
  showLogoWall: boolean;
};

export const SEGMENTS: Record<Segment["slug"], Segment> = {
  games: {
    slug: "games",
    industry: "games",
    metaTitle: "From 500 candidates to 5 · Recruitment for mobile game studios · MakersForge",
    metaDescription:
      "We headhunt UA, art, game design, Unity, product and LiveOps people for mobile game studios and hand you 5 screened candidates in 5 working days. Flat £12,500 per hire.",
    kicker: "For mobile game studios",
    headline: ["From 500", "candidates", "to 5."],
    lede: "UA managers, artists, game designers, Unity engineers and LiveOps people who'll never see your job ad. We find them, screen them and hand you 5 worth hiring, within 5 working days.",
    coverTitle: "Every seat in a mobile game studio.",
    clusters: [
      {
        label: "Growth & UA",
        roles: ["UA managers", "Growth managers", "Monetisation managers", "ASO managers"],
      },
      {
        label: "Art & creative",
        roles: ["Game artists (2D/3D)", "Marketing artists", "Motion designers", "Creative producers"],
      },
      {
        label: "Engineering",
        roles: ["Unity engineers", "Gameplay engineers", "Backend & live services"],
      },
      {
        label: "Product & game design",
        roles: ["Product managers", "Game designers", "LiveOps managers", "Game economy designers"],
      },
      {
        label: "Data",
        roles: ["Data analysts", "Analytics engineers", "Data scientists"],
      },
      {
        label: "Leadership",
        roles: ["Heads of Growth", "Art directors", "Technical directors"],
      },
    ],
    showLogoWall: true,
  },
  apps: {
    slug: "apps",
    industry: "apps",
    metaTitle: "From 500 candidates to 5 · Recruitment for consumer app companies · MakersForge",
    metaDescription:
      "We headhunt growth, UA, product, design, iOS and Android people for consumer app companies and hand you 5 screened candidates in 5 working days. Flat £12,500 per hire.",
    kicker: "For consumer app companies",
    headline: ["From 500", "candidates", "to 5."],
    lede: "Growth and UA leads, product managers, designers and iOS and Android engineers who'll never see your job ad. We find them, screen them and hand you 5 worth hiring, within 5 working days.",
    coverTitle: "Every seat in a consumer app team.",
    clusters: [
      {
        label: "Growth & UA",
        roles: ["UA managers", "Growth managers", "Monetisation managers", "ASO managers", "CRM & lifecycle"],
      },
      {
        label: "Product & design",
        roles: ["Product managers", "Product designers", "UI/UX designers", "UX researchers"],
      },
      {
        label: "Engineering",
        roles: ["iOS engineers", "Android engineers", "React Native & Flutter", "Backend engineers"],
      },
      {
        label: "Creative",
        roles: ["Motion designers", "Marketing designers", "Creative producers"],
      },
      {
        label: "Data",
        roles: ["Data analysts", "Data scientists", "Analytics engineers"],
      },
      {
        label: "Leadership",
        roles: ["Heads of Growth", "Heads of Product", "Heads of Engineering"],
      },
    ],
    showLogoWall: false,
  },
};
