import type { Metadata } from "next";
import Link from "next/link";
import { TOOLS, GUIDES_LINK } from "@/lib/resources";
import { GROUPS, liveGuides } from "@/lib/guides";
import styles from "../guides/guides.module.css";
import r from "./resources.module.css";

export const metadata: Metadata = {
  title: "Free hiring resources for mobile games studios · MakersForge",
  description: "Free tools and guides for hiring in mobile games and apps: grade your job ad, compare every way to hire, and practical answers to the questions studios ask.",
  alternates: { canonical: "/resources" },
};

/* The Resources hub (Andre 2026-11-08): every free tool and guide in one
   place; the nav menu points here. DRAFT copy for Andre. */
export default function ResourcesPage() {
  const guides = liveGuides();
  return (
    <section className={styles.wrap}>
      <div className="container">
        <header className={styles.head}>
          <h1 className={styles.display}>
            Hire better, <span className="gr">for free</span>
          </h1>
          <p className={styles.lede}>Tools and guides for hiring in mobile games and apps. Use them whether or not you ever work with us.</p>
        </header>

        <div className={r.grid}>
          {TOOLS.map((t) => (
            <Link key={t.href} href={t.href} className={r.card}>
              <span className={r.tag}>{t.tag}</span>
              <strong>{t.title}</strong>
              <p>{t.blurb}</p>
              <em>Try it →</em>
            </Link>
          ))}
        </div>

        {guides.length > 0 && (
          <div className={styles.groups} style={{ marginTop: 56 }}>
            <div className={styles.groupHead}>
              <h2>{GUIDES_LINK.title}</h2>
              <p>{GUIDES_LINK.blurb}</p>
            </div>
            {GROUPS.map((g) => {
              const items = guides.filter((x) => x.group === g.id);
              return items.length ? (
                <div key={g.id} className={styles.list}>
                  {items.map((x) => (
                    <Link key={x.slug} href={`/guides/${x.slug}`} className={styles.q}>
                      <strong>{x.q}</strong>
                      <span>{x.magnet ? `${x.teaser} Includes: ${x.magnet.name}.` : x.teaser}</span>
                      <em>Read →</em>
                    </Link>
                  ))}
                </div>
              ) : null;
            })}
          </div>
        )}
      </div>
    </section>
  );
}
