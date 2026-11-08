import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GROUPS, visibleGuides, isLive, showDrafts } from "@/lib/guides";
import styles from "./guides.module.css";

/* The hiring guides (Andre 2026-11-08): a list of the questions studios ask,
   each opening its own article. Hidden on the live site until the first
   guide is published. Headline and lede are DRAFT copy for Andre. */
export const metadata: Metadata = {
  title: "Hiring guides for mobile games and apps · MakersForge",
  description: "Practical answers to the questions studios ask about hiring in mobile games and apps: when to hire, how to hire faster, and how to get it right.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  const guides = visibleGuides();
  if (!guides.length) notFound();

  return (
    <section className={styles.wrap}>
      <div className="container">
        <header className={styles.head}>
          {showDrafts() && <span className={styles.draftNote}>Preview: drafts show here, only published guides show on the live site</span>}
          <h1 className={styles.display}>
            Hiring in mobile games, <span className="gr">answered</span>
          </h1>
          <p className={styles.lede}>Practical answers to the questions studios ask us most, from years of hiring for mobile games and apps. Take them and use them.</p>
        </header>

        <div className={styles.groups}>
          {GROUPS.map((g) => {
            const items = guides.filter((x) => x.group === g.id);
            if (!items.length) return null;
            return (
              <section key={g.id}>
                <div className={styles.groupHead}>
                  <h2>{g.title}</h2>
                  <p>{g.blurb}</p>
                </div>
                <div className={styles.list}>
                  {items.map((x) => (
                    <Link key={x.slug} href={`/guides/${x.slug}`} className={styles.q}>
                      <strong>
                        {x.q}
                        {!isLive(x) && <i>Draft</i>}
                      </strong>
                      <span>{x.teaser}</span>
                      <em>Read →</em>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
