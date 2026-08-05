import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SPEC_CLIENTS, getSpecClient, type SpecStatus } from "@/data/job-specs";
import styles from "../jobspecs.module.css";

export function generateStaticParams() {
  return SPEC_CLIENTS.map((c) => ({ client: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ client: string }>;
}): Promise<Metadata> {
  const { client } = await params;
  const c = getSpecClient(client);
  return {
    title: `${c?.name ?? "Client"} job specs · MakersForge Handbook`,
    robots: { index: false, follow: false },
  };
}

const STATUS_CLASS: Record<SpecStatus, string> = {
  open: styles.statusOpen,
  filled: styles.statusFilled,
  "on-hold": styles.statusHold,
};
const STATUS_LABEL: Record<SpecStatus, string> = {
  open: "Open",
  filled: "Filled",
  "on-hold": "On hold",
};

export default async function ClientSpecsPage({
  params,
}: {
  params: Promise<{ client: string }>;
}) {
  const { client } = await params;
  const c = getSpecClient(client);
  if (!c) notFound();

  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/handbook">Handbook</Link>
          <span className={styles.crumbSep}>/</span>
          <Link href="/handbook/job-specs">Job specs</Link>
          <span className={styles.crumbSep}>/</span>
          <span className={styles.crumbHere}>{c.name}</span>
        </nav>

        <header className={styles.hero}>
          <p className={styles.kicker}>MakersForge · Job specs</p>
          <h1 className={styles.title}>{c.name}</h1>
          {c.blurb && <p className={styles.intro}>{c.blurb}</p>}
        </header>

        {c.specs.length === 0 ? (
          <div className={styles.empty}>
            No specs in this folder yet. They&apos;ll appear here as soon as
            they&apos;re added.
          </div>
        ) : (
          <div className={styles.specList}>
            {c.specs.map((s) => (
              <Link
                key={s.slug}
                href={`/handbook/job-specs/${c.slug}/${s.slug}`}
                className={styles.specRow}
              >
                <div className={styles.specRowMain}>
                  <div className={styles.specRowTitle}>
                    {s.title}
                    {s.status && (
                      <span
                        className={`${styles.status} ${STATUS_CLASS[s.status]}`}
                      >
                        {STATUS_LABEL[s.status]}
                      </span>
                    )}
                  </div>
                  <div className={styles.specRowMeta}>
                    {[s.engagement, s.discipline, s.location]
                      .filter(Boolean)
                      .join(" · ") || "Role brief"}
                  </div>
                </div>
                <span className={styles.specRowOpen}>Open spec →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
