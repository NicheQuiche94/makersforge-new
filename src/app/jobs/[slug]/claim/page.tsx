import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllJobSlugs, getJob } from "@/lib/jobs";
import { ClaimForm, type ClaimDefaults } from "@/components/jobs/ClaimForm";
import styles from "./claim.module.css";

// Statically generated per role, like the job pages. Never indexed — these are
// action pages, not content.
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
  return {
    title: `Claim ${job.title} at ${job.company.name} | MakersForge`,
    robots: { index: false, follow: false },
  };
}

export default async function ClaimPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) notFound();

  const t = job.terms;
  const defaults: ClaimDefaults = {
    currency: t?.pay?.currency,
    payMin: t?.pay?.min,
    payMax: t?.pay?.max,
    payPeriod: t?.pay?.period,
    contract: t?.contract?.type,
    hoursPerWeek: t?.hours?.per_week,
    fullTime: t?.hours?.full_time,
    remoteScope: t?.location?.remote_scope,
    remoteWhere: t?.location?.remote_where,
    isRemote: job.remote === "remote",
  };

  return (
    <div className={styles.page}>
      <div className="jobs-wrap">
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/jobs">The board</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/jobs/${job.slug}`}>{job.title}</Link>
          <span aria-hidden="true">/</span>
          <span>Claim</span>
        </nav>

        <header className={styles.head}>
          <p className="kicker">Fair Board Standard</p>
          <h1 className={styles.title}>Claim this listing</h1>
          <p className={styles.intro}>
            We sourced this role from {job.company.name}&apos;s public posting.
            If you&apos;re hiring for it, claim it to verify the details and meet
            the Fair Board Standard. Once we confirm it&apos;s you, the listing
            shows as employer-verified with exactly what you state.
          </p>
        </header>

        <div className={styles.role}>
          <p className={styles.roleKicker}>You&apos;re claiming</p>
          <span className={styles.roleTitle}>{job.title}</span>
          <span className={styles.roleCompany}>· {job.company.name}</span>
        </div>

        <div className={styles.formWrap}>
          <ClaimForm
            slug={job.slug}
            company={job.company.name}
            title={job.title}
            defaults={defaults}
          />
        </div>
      </div>
    </div>
  );
}
