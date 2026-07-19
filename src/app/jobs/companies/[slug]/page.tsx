import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllCompanySlugs,
  getCompany,
  SECTOR_LABELS,
} from "@/lib/jobs";
import { absoluteUrl } from "@/lib/site";
import { JobCard } from "@/components/jobs/JobCard";
import { HiringCTA } from "@/components/jobs/JobCtas";
import styles from "./company.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCompanySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getCompany(slug);
  if (!entry) return {};
  const { company } = entry;
  const title = `${company.name}, UA & Growth Jobs in ${SECTOR_LABELS[company.sector]} | MakersForge`;
  return {
    title,
    description: `${company.blurb} See live UA, growth and marketing-art roles at ${company.name} on MakersForge.`,
    alternates: { canonical: `/jobs/companies/${company.slug}` },
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getCompany(slug);
  if (!entry) notFound();

  const { company, live, expired } = entry;

  const orgSchema = {
    "@context": "https://schema.org/",
    "@type": "Organization",
    name: company.name,
    url: company.url,
    description: company.blurb,
    ...(company.logo ? { logo: absoluteUrl(company.logo) } : {}),
  };

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      <div className="jobs-wrap">
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/jobs">The board</Link>
          <span aria-hidden="true">/</span>
          <span>{company.name}</span>
        </nav>

        <header className={styles.head}>
          <span className={styles.sector}>
            {SECTOR_LABELS[company.sector]}
            {company.size ? ` · ${company.size} people` : ""}
            {company.stage ? ` · ${company.stage}` : ""}
            {company.funding ? ` · ${company.funding}` : ""}
          </span>
          <h1 className={styles.title}>{company.name}</h1>
          <p className={styles.blurb}>{company.blurb}</p>
          <a
            href={company.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.website}
          >
            Visit website →
          </a>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionH}>
            {live.length > 0
              ? `Live roles (${live.length})`
              : "No live roles right now"}
          </h2>
          {live.length > 0 ? (
            <div className={styles.grid}>
              {live.map((job) => (
                <JobCard key={job.slug} job={job} />
              ))}
            </div>
          ) : (
            <p className={styles.muted}>
              Nothing open at {company.name} on the board today.
            </p>
          )}
        </section>

        {expired.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionH}>Past roles</h2>
            <ul className={styles.pastList}>
              {expired.map((job) => (
                <li key={job.slug}>
                  <Link href={`/jobs/${job.slug}`}>{job.title}</Link>
                  <span className={styles.pastMeta}>{job.location}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className={styles.cta}>
          <HiringCTA />
        </div>
      </div>
    </div>
  );
}
