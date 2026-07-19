import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  getJobsByCategory,
  type JobCategory,
} from "@/lib/jobs";
import { CATEGORY_COPY } from "@/lib/categoryCopy";
import { JobCard } from "@/components/jobs/JobCard";
import { AlertForm } from "@/components/jobs/AlertForm";
import styles from "./category.module.css";

export const dynamicParams = false;

function isCategory(v: string): v is JobCategory {
  return (CATEGORY_ORDER as string[]).includes(v);
}

export function generateStaticParams() {
  return CATEGORY_ORDER.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) return {};
  const copy = CATEGORY_COPY[category];
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: { canonical: `/jobs/categories/${category}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isCategory(category)) notFound();

  const copy = CATEGORY_COPY[category];
  const jobs = getJobsByCategory(category);

  return (
    <div className={styles.page}>
      <div className="jobs-wrap">
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/jobs">The board</Link>
          <span aria-hidden="true">/</span>
          <span>{CATEGORY_LABELS[category]}</span>
        </nav>

        <header className={styles.head}>
          <p className="kicker">Category</p>
          <h1 className={styles.title}>{copy.h1}</h1>
          <p className={styles.intro}>{copy.intro}</p>
          <Link href={`/jobs?category=${category}`} className={styles.boardLink}>
            Filter the full board by {CATEGORY_LABELS[category]} →
          </Link>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionH}>
            {jobs.length > 0
              ? `${jobs.length} live ${jobs.length === 1 ? "role" : "roles"}`
              : "No live roles right now"}
          </h2>

          {jobs.length > 0 ? (
            <div className={styles.grid}>
              {jobs.map((job) => (
                <JobCard key={job.slug} job={job} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyForm}>
              <p className={styles.muted}>
                Nothing live in {CATEGORY_LABELS[category]} right now, get
                alerted the moment there is.
              </p>
              <AlertForm
                source={`category:${category}`}
                presetCategory={category}
                compact
              />
            </div>
          )}
        </section>

        {jobs.length > 0 && (
          <section className={styles.alertSection}>
            <AlertForm source={`category:${category}`} presetCategory={category} />
          </section>
        )}
      </div>
    </div>
  );
}
