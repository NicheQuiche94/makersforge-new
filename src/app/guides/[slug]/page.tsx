import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AUTHOR, GUIDES, blocks, guideBySlug, isLive, readMins, visibleGuides, type Inline } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";
import { GuideMagnet } from "./GuideMagnet";
import styles from "../guides.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = guideBySlug((await params).slug);
  if (!g) return {};
  return {
    title: `${g.q} · The Hiring Playbook · MakersForge`,
    description: g.short || g.teaser,
    alternates: { canonical: `/guides/${g.slug}` },
    openGraph: { title: g.q, description: g.short || g.teaser, type: "article" },
    ...(isLive(g) ? {} : { robots: { index: false, follow: false } }),
  };
}

const date = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

function Parts({ parts }: { parts: Inline[] }) {
  return (
    <>
      {parts.map((p, i) =>
        p.t === "b" ? <strong key={i}>{p.v}</strong> : p.t === "i" ? <em key={i}>{p.v}</em> : p.t === "a" ? <a key={i} href={p.href}>{p.v}</a> : <span key={i}>{p.v}</span>,
      )}
    </>
  );
}

export default async function GuidePage({ params }: Props) {
  const g = guideBySlug((await params).slug);
  if (!g) notFound();
  const live = isLive(g);
  const url = `${SITE_URL}/guides/${g.slug}`;
  const others = visibleGuides().filter((x) => x.slug !== g.slug && (x.group === g.group || live)).slice(0, 3);

  // Tells search engines and AI tools: a question, answered by a named person, on this date.
  const ld = live
    ? [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: g.q,
          description: g.short || g.teaser,
          datePublished: g.published,
          dateModified: g.updated || g.published,
          author: { "@type": "Person", name: AUTHOR.name, jobTitle: AUTHOR.role },
          publisher: { "@type": "Organization", name: "MakersForge", url: SITE_URL },
          mainEntityOfPage: url,
        },
        ...(g.short
          ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: g.q, acceptedAnswer: { "@type": "Answer", text: g.short } }] }]
          : []),
      ]
    : [];

  return (
    <section className={styles.wrap}>
      {ld.map((x, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(x) }} />
      ))}
      <div className="container">
        <article className={styles.article}>
          <Link href="/guides" className={styles.back}>← The Hiring Playbook</Link>
          {!live && <p className={styles.draftNote}>Draft: only visible on previews until it&apos;s published</p>}
          <h1 className={styles.title}>{g.q}</h1>
          <p className={styles.meta}>
            {AUTHOR.name}, {AUTHOR.role}
            {g.published ? ` · ${date(g.updated || g.published)}` : ""}
            {g.body ? ` · ${readMins(g)} min read` : ""}
          </p>

          {g.short && (
            <div className={styles.short}>
              <b>In short</b>
              <p>{g.short}</p>
            </div>
          )}

          <div className={styles.body}>
            {g.body ? (
              blocks(g.body).map((b, i) =>
                b.k === "ul" ? (
                  <ul key={i}>{b.items.map((it, j) => <li key={j}><Parts parts={it} /></li>)}</ul>
                ) : b.k === "ol" ? (
                  <ol key={i}>{b.items.map((it, j) => <li key={j}><Parts parts={it} /></li>)}</ol>
                ) : b.k === "h2" ? (
                  <h2 key={i}><Parts parts={b.parts} /></h2>
                ) : b.k === "h3" ? (
                  <h3 key={i}><Parts parts={b.parts} /></h3>
                ) : b.k === "quote" ? (
                  <blockquote key={i}><Parts parts={b.parts} /></blockquote>
                ) : (
                  <p key={i}><Parts parts={"parts" in b ? b.parts : []} /></p>
                ),
              )
            ) : (
              <p className={styles.pending}>Andre is writing this one.</p>
            )}
          </div>

          {g.magnet && <GuideMagnet slug={g.slug} magnet={g.magnet} />}

          <div className={styles.cta}>
            <p>Hiring for a mobile games or apps role? See how every route compares for yours: cost, weeks to hire and your team&apos;s hours.</p>
            <Link href="/compare" className={styles.go}>Compare hiring routes →</Link>
          </div>

          {others.length > 0 && (
            <nav className={styles.next} aria-label="More from The Hiring Playbook">
              <h2>More questions</h2>
              <div className={styles.list}>
                {others.map((x) => (
                  <Link key={x.slug} href={`/guides/${x.slug}`} className={styles.q}>
                    <strong>{x.q}</strong>
                    <span>{x.teaser}</span>
                    <em>Read →</em>
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </article>
      </div>
    </section>
  );
}

export const dynamicParams = false;
// Live list is fixed at build time; publishing a guide is a deploy.
export const revalidate = false;
