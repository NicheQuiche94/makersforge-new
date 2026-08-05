import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SPEC_CLIENTS, getSpec, type SpecStatus } from "@/data/job-specs";
import { PitchBlock } from "../../PitchBlock";
import styles from "../../jobspecs.module.css";

export function generateStaticParams() {
  return SPEC_CLIENTS.flatMap((c) =>
    c.specs.map((s) => ({ client: c.slug, spec: s.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ client: string; spec: string }>;
}): Promise<Metadata> {
  const { client, spec } = await params;
  const found = getSpec(client, spec);
  return {
    title: found
      ? `${found.spec.title} · ${found.client.name} · MakersForge Handbook`
      : "Job spec · MakersForge Handbook",
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

export default async function SpecPage({
  params,
}: {
  params: Promise<{ client: string; spec: string }>;
}) {
  const { client, spec } = await params;
  const found = getSpec(client, spec);
  if (!found) notFound();
  const { client: c, spec: s } = found;

  const meta = [
    s.engagement && { label: "Engagement", value: s.engagement },
    s.salary && { label: "Salary", value: s.salary },
    s.discipline && { label: "Discipline", value: s.discipline },
    s.location && { label: "Location", value: s.location },
    s.fee && { label: "Fee", value: s.fee },
    s.updated && { label: "Updated", value: s.updated },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/handbook">Handbook</Link>
          <span className={styles.crumbSep}>/</span>
          <Link href="/handbook/job-specs">Job specs</Link>
          <span className={styles.crumbSep}>/</span>
          <Link href={`/handbook/job-specs/${c.slug}`}>{c.name}</Link>
          <span className={styles.crumbSep}>/</span>
          <span className={styles.crumbHere}>{s.title}</span>
        </nav>

        <article className={styles.doc}>
          <header className={styles.docHead}>
            <p className={styles.kicker}>{c.name} · Role brief</p>
            <h1 className={styles.docTitle}>
              {s.title}
              {s.status && (
                <span className={`${styles.status} ${STATUS_CLASS[s.status]}`}>
                  {STATUS_LABEL[s.status]}
                </span>
              )}
            </h1>
            {meta.length > 0 && (
              <div className={styles.docMeta}>
                {meta.map((m) => (
                  <span key={m.label} className={styles.docMetaItem}>
                    <strong>{m.label}:</strong> {m.value}
                  </span>
                ))}
              </div>
            )}
            {s.summary && <p className={styles.docSummary}>{s.summary}</p>}
          </header>

          {(s.sections ?? []).map((sec, i) => (
            <section key={i} className={styles.section}>
              <h2 className={styles.sectionH}>{sec.heading}</h2>
              {(sec.body ?? []).map((p, j) => (
                <p key={j} className={styles.sectionP}>
                  {p}
                </p>
              ))}
              {sec.bullets && sec.bullets.length > 0 && (
                <ul className={styles.bullets}>
                  {sec.bullets.map((b, k) => (
                    <li key={k}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {s.pitch && (
            <section className={styles.section}>
              <h2 className={styles.sectionH}>Outreach pitch</h2>
              <PitchBlock text={s.pitch} />
            </section>
          )}
        </article>
      </div>
    </div>
  );
}
