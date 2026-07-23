import Link from "next/link";
import {
  type Job,
  CATEGORY_SHORT,
  REMOTE_LABELS,
  shortLocation,
} from "@/lib/jobs";
import { formatPay } from "@/lib/terms";
import { formatPosted } from "@/lib/jobDate";
import styles from "./JobCard.module.css";

/**
 * Job row, full-width, single-line-ish layout for a familiar job-board feel.
 *
 * Links to the job PAGE, never straight to the external apply URL: every
 * click passes through our page so we keep the pageview and the CTA surface
 * (brief §4). Kept free of client-only hooks so it renders inside both the
 * server company page and the client-side filtered board.
 */
export function JobCard({ job }: { job: Job }) {
  // Pay on the card itself, not only on the detail page — a disclosed salary is
  // the strongest signal a candidate scans for (Andre 2026-07-23).
  const pay = formatPay(job.terms?.pay);

  return (
    <Link href={`/jobs/${job.slug}`} className={styles.row}>
      <Monogram name={job.company.name} logo={job.company.logo} />

      <div className={styles.main}>
        <h3 className={styles.title}>{job.title}</h3>
        <div className={styles.meta}>
          <span className={styles.company}>{job.company.name}</span>
          <span className={styles.dot} aria-hidden="true">
            ·
          </span>
          <span className={styles.location}>{shortLocation(job.location)}</span>
          <span className={styles.category}>{CATEGORY_SHORT[job.category]}</span>
          {job.company.stage && (
            <span className={styles.stage}>{job.company.stage}</span>
          )}
        </div>
      </div>

      <div className={styles.aside}>
        {pay && <span className={styles.pay}>{pay}</span>}
        <span className={styles.remote} data-mode={job.remote}>
          {REMOTE_LABELS[job.remote]}
        </span>
        <span className={styles.posted}>
          {formatPosted(job.posted_at, job.ingested_at)}
        </span>
        <span className={styles.view} aria-hidden="true">
          View →
        </span>
      </div>
    </Link>
  );
}

/** Company logo if we have one, otherwise a heat-gradient monogram. */
function Monogram({ name, logo }: { name: string; logo?: string }) {
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element -- static curated logos, no optimisation needed
    return <img src={logo} alt="" className={styles.logo} width={44} height={44} />;
  }
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <span className={styles.monogram} aria-hidden="true">
      {initials}
    </span>
  );
}
