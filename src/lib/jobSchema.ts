/**
 * Builds the JobPosting schema.org JSON-LD for a job page (brief §4/§5).
 *
 * This is the primary traffic engine — it's what surfaces the role in
 * Google's job results — so it must be present in the statically rendered
 * HTML and validate against Google's Rich Results test. Populated fields:
 * title, description (HTML), datePosted, validThrough, employmentType,
 * hiringOrganization, jobLocation / jobLocationType (TELECOMMUTE for
 * remote), directApply: false (we always link out to the employer).
 *
 * `salary` is intentionally NOT emitted as baseSalary: it's a free-text
 * display string, and a malformed MonetaryAmount is worse than none.
 */

import type { Job } from "./jobs";
import { REGION_LABELS } from "./jobs";
import { absoluteUrl } from "./site";

export function buildJobPostingSchema(job: Job): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: descriptionToHtml(job.description_md),
    datePosted: job.posted_at,
    validThrough: `${job.expires_at}T23:59:59`,
    employmentType: job.employment_type,
    directApply: false,
    url: absoluteUrl(`/jobs/${job.slug}`),
    identifier: {
      "@type": "PropertyValue",
      name: job.company.name,
      value: job.slug,
    },
    hiringOrganization: {
      "@type": "Organization",
      name: job.company.name,
      sameAs: job.company.url,
      ...(job.company.logo
        ? { logo: absoluteUrl(job.company.logo) }
        : {}),
    },
  };

  const { locality, country } = parseLocation(job.location);

  if (job.remote === "remote") {
    schema.jobLocationType = "TELECOMMUTE";
    schema.applicantLocationRequirements = {
      "@type": "AdministrativeArea",
      name: country || REGION_LABELS[job.region ?? "global"],
    };
  }

  // Physical location for on-site/hybrid (and remote roles that still name
  // a base city). Google accepts a partial address; locality + country is
  // the useful minimum.
  if ((locality || country) && job.remote !== "remote") {
    schema.jobLocation = {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        ...(locality ? { addressLocality: locality } : {}),
        ...(country ? { addressCountry: country } : {}),
      },
    };
  }

  return schema;
}

/** Split "Istanbul, Türkiye" → {locality, country}. Remote-only strings
 *  (no comma, or containing "Remote") yield no physical address. */
function parseLocation(location: string): {
  locality?: string;
  country?: string;
} {
  if (/remote/i.test(location) && !location.includes(",")) return {};
  const parts = location.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return { locality: parts[0], country: parts[parts.length - 1] };
  }
  if (parts.length === 1 && !/remote/i.test(parts[0])) {
    return { country: parts[0] };
  }
  return {};
}

/** Convert our description_md subset to a small HTML string for the schema
 *  `description` field. Escapes text; supports paragraphs, `- ` lists and
 *  **bold**. */
export function descriptionToHtml(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let bullets: string[] = [];

  const flush = () => {
    if (!bullets.length) return;
    out.push(`<ul>${bullets.map((b) => `<li>${inline(b)}</li>`).join("")}</ul>`);
    bullets = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("- ")) {
      bullets.push(line.slice(2));
      continue;
    }
    flush();
    if (line.length === 0) continue;
    out.push(`<p>${inline(line)}</p>`);
  }
  flush();
  return out.join("");
}

function inline(text: string): string {
  return escapeHtml(text).replace(
    /\*\*(.+?)\*\*/g,
    (_m, inner) => `<strong>${inner}</strong>`,
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
