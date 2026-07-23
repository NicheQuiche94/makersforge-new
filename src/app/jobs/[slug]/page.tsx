import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllJobSlugs,
  getJob,
  isExpired,
  CATEGORY_LABELS,
  SECTOR_LABELS,
  REMOTE_LABELS,
  EMPLOYMENT_LABELS,
} from "@/lib/jobs";
import { buildJobPostingSchema } from "@/lib/jobSchema";
import { formatPay } from "@/lib/terms";
import { formatPosted } from "@/lib/jobDate";
import { JobDescription } from "@/components/jobs/JobDescription";
import { TransparencyPanel } from "@/components/jobs/TransparencyPanel";
import { CandidateCTA, HiringCTA } from "@/components/jobs/JobCtas";
import styles from "./job.module.css";

// Fully static: every job page (live AND expired) is pre-rendered at build.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllJobSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) return {};

  const title = `${job.title} at ${job.company.name}, UA & Growth Jobs in Games & Apps | MakersForge`;
  const description = `${job.title} at ${job.company.name}. ${job.location} · ${REMOTE_LABELS[job.remote]}. Apply via MakersForge, the job board for UA, growth and marketing-art roles in games and apps.`;

  return {
    title,
    description,
    alternates: { canonical: `/jobs/${job.slug}` },
    openGraph: { title, description, type: "website" },
    robots: isExpired(job) ? { index: true, follow: true } : undefined,
  };
}

export default async function JobPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) notFound();

  const expired = isExpired(job);

  return (
    <article className={styles.page}>
      {/* JobPosting structured data, the primary traffic engine (brief §5).
          Present in the static HTML so Google's job crawler reads it.
          Dropped once the role expires: Google flags live JobPosting markup
          on closed roles, so the page stays only as long-tail content. */}
      {!expired && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildJobPostingSchema(job)),
          }}
        />
      )}

      <div className="jobs-wrap">
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/jobs">The board</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/jobs/companies/${job.company.slug}`}>
            {job.company.name}
          </Link>
        </nav>

        <header className={`${styles.head} ${expired ? styles.headExpired : ""}`}>
          {expired && (
            <p className={styles.expiredBanner}>
              This role has been filled or closed.
            </p>
          )}
          <div className={styles.headTop}>
            <span className={styles.category}>
              {CATEGORY_LABELS[job.category]}
            </span>
            <span className={styles.sector}>
              {SECTOR_LABELS[job.company.sector]}
            </span>
          </div>
          <h1 className={styles.title}>{job.title}</h1>
          <Link
            href={`/jobs/companies/${job.company.slug}`}
            className={styles.company}
          >
            {job.company.name}
          </Link>

          <div className={styles.facts}>
            <Fact label="Location" value={job.location} />
            <Fact label="Work mode" value={REMOTE_LABELS[job.remote]} />
            <Fact
              label="Type"
              value={EMPLOYMENT_LABELS[job.employment_type]}
            />
            {(formatPay(job.terms?.pay) ?? job.salary) && (
              <Fact
                label="Salary"
                value={formatPay(job.terms?.pay) ?? job.salary!}
              />
            )}
          </div>

          {!expired && (
            <div className={styles.applyRow}>
              <a
                href={job.apply_url}
                target="_blank"
                rel="nofollow noopener"
                className={`btn btn-primary ${styles.applyBtn}`}
              >
                <span className="btn-label">Apply at {job.company.name}</span>
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </a>
              <span className={styles.posted}>
                {formatPosted(job.posted_at, job.ingested_at)}
              </span>
            </div>
          )}
        </header>

        <div className={styles.layout}>
          <div className={styles.main}>
            <JobDescription md={job.description_md} />

            {!expired && (
              <a
                href={job.apply_url}
                target="_blank"
                rel="nofollow noopener"
                className={`btn btn-primary ${styles.applyBtnLower}`}
              >
                <span className="btn-label">Apply at {job.company.name}</span>
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            )}
          </div>

          <aside className={styles.side}>
            <TransparencyPanel
              terms={job.terms}
              mode={job.remote}
              source={job.source}
              company={job.company.name}
            />
            <div className={styles.companyCard}>
              <p className={styles.sideKicker}>About {job.company.name}</p>
              <p className={styles.blurb}>{job.company.blurb}</p>
              <dl className={styles.companyMeta}>
                {job.company.size && (
                  <div>
                    <dt>Team size</dt>
                    <dd>{job.company.size}</dd>
                  </div>
                )}
                {job.company.stage && (
                  <div>
                    <dt>Funding stage</dt>
                    <dd>{job.company.stage}</dd>
                  </div>
                )}
                {job.company.funding && (
                  <div>
                    <dt>Funding</dt>
                    <dd>{job.company.funding}</dd>
                  </div>
                )}
                <div>
                  <dt>Sector</dt>
                  <dd>{SECTOR_LABELS[job.company.sector]}</dd>
                </div>
              </dl>
              <Link
                href={`/jobs/companies/${job.company.slug}`}
                className={styles.companyLink}
              >
                All roles at {job.company.name} →
              </Link>
            </div>
          </aside>
        </div>

        <div className={styles.ctas}>
          <CandidateCTA />
          {expired && <HiringCTA />}
        </div>
      </div>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.fact}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
