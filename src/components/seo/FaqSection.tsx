import styles from "./FaqSection.module.css";

/**
 * Server-rendered FAQ (2026-07-19) — answers sit in the static HTML (no
 * accordion hiding them) and the same items emit FAQPage JSON-LD. Answer
 * engines lift these Q&As near-verbatim, so this is the highest-ROI AEO
 * surface. Answers are plain strings so the visible copy and the schema
 * can never drift apart.
 */
export type FaqItem = { q: string; a: string };

export function FaqSection({
  kicker = "FAQ",
  heading,
  items,
}: {
  kicker?: string;
  heading: string;
  items: FaqItem[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <section className={styles.section}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="container">
        <div className={styles.inner}>
          <header className={styles.header}>
            <p className="kicker">{kicker}</p>
            <h2 className={styles.h2}>{heading}</h2>
          </header>

          <dl className={styles.list}>
            {items.map((item) => (
              <div key={item.q} className={styles.item}>
                <dt className={styles.q}>{item.q}</dt>
                <dd className={styles.a}>{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
