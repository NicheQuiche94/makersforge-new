import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { ROSTER } from "@/data/roster";
import { liveGuides } from "@/lib/guides";

/**
 * Site sitemap, regenerated at every build. The job board (/jobs, its job,
 * company and category pages) is left out while it's on hold (Andre
 * 2026-11-09: "take it out the site map until we re-build"). The pages still
 * load for anyone with a link. To bring it back, restore the board, category,
 * job and company entries from git history (getAllJobs, getAllCompanySlugs,
 * CATEGORY_ORDER in lib/jobs).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const core: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/games`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/apps`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/line-up`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/talent`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/pricing`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/compare`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/job-ad-grading-tool`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/resources`, changeFrequency: "weekly", priority: 0.8 },
  ];

  // Every talent profile (anonymised, consented) and the hiring guides once published.
  const profiles: MetadataRoute.Sitemap = ROSTER.map((p) => ({ url: `${SITE_URL}/line-up/${p.id}/spec`, changeFrequency: "weekly", priority: 0.7 }));
  const live = liveGuides();
  const guides: MetadataRoute.Sitemap = live.length
    ? [
        { url: `${SITE_URL}/guides`, changeFrequency: "weekly", priority: 0.9 },
        ...live.map((g) => ({ url: `${SITE_URL}/guides/${g.slug}`, lastModified: g.updated || g.published || undefined, changeFrequency: "monthly" as const, priority: 0.8 })),
      ]
    : [];

  return [...core, ...profiles, ...guides];
}
