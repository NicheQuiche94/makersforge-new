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
    metaTitle: "Hiring for mobile game studios · MakersForge",
    metaDescription:
      "UA and growth, game and marketing art, Unity and Unreal engineers, product, LiveOps and data for mobile game studios. From our lineup, or a targeted search. Flat fees.",
    kicker: "For mobile game studios",
    headline: ["Hiring for", "mobile game", "studios."],
    lede: "UA and growth, game and marketing art, Unity and Unreal engineers, product, LiveOps and data. Straight from our lineup, or a targeted search when no one on it fits. Flat fees, never a cut of salary.",
    coverTitle: "Every seat in a mobile game studio.",
    clusters: [
      {
        label: "Growth & UA",
        roles: ["UA managers", "Growth managers", "ASO managers", "Ad monetisation"],
      },
      {
        label: "Art & creative",
        roles: ["Game artists (2D/3D)", "Marketing artists", "Motion designers", "Creative producers"],
      },
      {
        label: "Engineering",
        roles: ["Unity & Unreal engineers", "Gameplay engineers", "Backend & live services"],
      },
      {
        label: "Product & LiveOps",
        roles: ["Product managers", "LiveOps managers", "Game economy designers"],
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
    metaTitle: "Hiring for consumer app companies · MakersForge",
    metaDescription:
      "Growth and UA, product managers and designers, iOS and Android engineers, creative and data for consumer app companies. From our lineup, or a targeted search. Flat fees.",
    kicker: "For consumer app companies",
    headline: ["Hiring for", "consumer app", "companies."],
    lede: "Growth and UA, product managers and designers, iOS and Android engineers, creative and data. Straight from our lineup, or a targeted search when no one on it fits. Flat fees, never a cut of salary.",
    coverTitle: "Every seat in a consumer app team.",
    clusters: [
      {
        label: "Growth & UA",
        roles: ["UA managers", "Growth managers", "ASO managers", "CRM & lifecycle"],
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
