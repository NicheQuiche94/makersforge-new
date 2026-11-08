import type { MetadataRoute } from "next";
import {
  getAllJobs,
  getAllCompanySlugs,
  CATEGORY_ORDER,
  isExpired,
} from "@/lib/jobs";
import { SITE_URL } from "@/lib/site";
import { ROSTER } from "@/data/roster";
import { liveGuides } from "@/lib/guides";

/**
 * Site sitemap, regenerated at every build (brief §5). Covers the core
 * marketing pages plus every job, company and category-landing URL so the
 * whole board is discoverable. Expired job pages stay in the sitemap — they
 * keep ranking for us after the role dies (brief §3).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/games`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/apps`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/line-up`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/talent`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/pricing`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/compare`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/job-ad-grading-tool`, changeFrequency: "monthly", priority: 0.9 },
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

  const board: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/jobs`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/jobs/post`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/jobs/standard`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const categories: MetadataRoute.Sitemap = CATEGORY_ORDER.map((c) => ({
    url: `${SITE_URL}/jobs/categories/${c}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const jobs: MetadataRoute.Sitemap = getAllJobs().map((job) => ({
    url: `${SITE_URL}/jobs/${job.slug}`,
    lastModified: job.posted_at,
    changeFrequency: isExpired(job, now) ? "monthly" : "weekly",
    priority: isExpired(job, now) ? 0.3 : 0.8,
  }));

  const companies: MetadataRoute.Sitemap = getAllCompanySlugs().map((slug) => ({
    url: `${SITE_URL}/jobs/companies/${slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...core, ...profiles, ...guides, ...board, ...categories, ...jobs, ...companies];
}
