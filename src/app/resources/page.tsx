import type { Metadata } from "next";
import Link from "next/link";
import { TOOLS, GUIDES_LINK, DOWNLOADS } from "@/lib/resources";
import { GROUPS, liveGuides } from "@/lib/guides";
import { ResourcesGate } from "./ResourcesGate";
import styles from "../guides/guides.module.css";
import r from "./resources.module.css";

export const metadata: Metadata = {
  title: "Free hiring resources for mobile games studios · MakersForge",
  description: "Free guides, reports and tools for hiring in mobile games and apps: the 4 ways to find talent, grade your job ad, and compare every way to hire.",
  alternates: { canonical: "/resources" },
};

/* Tool colours follow the guide's method palette (resource style v2). */
const TOOL_STYLE: Record<string, { tone: string; icon: React.ReactNode }> = {
  "/job-ad-grading-tool": {
    tone: "linear-gradient(135deg, #22c55e, #15803d)",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true"><rect x="9" y="6" width="30" height="36" rx="5" /><path d="M16 18h16M16 26h16M16 34h9" /></svg>
    ),
  },
  "/hire-timeline": {
    tone: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="25" r="16" /><path d="M24 15v10l7 5" /></svg>
    ),
  },
  "/compare": {
    tone: "linear-gradient(135deg, #8b5cf6, #5b21b6)",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 8v32M10 14h28M10 14l-5 12h10zM38 14l-5 12h10zM16 40h16" /></svg>
    ),
  },
};

/* The Resources hub (Andre 2026-11-08, redesigned 2026-11-24 in the guide
   style). One email unlocks everything. DRAFT copy for Andre. */
export default function ResourcesPage() {
  const guides = liveGuides();
  return (
    <section className={r.wrap}>
      <div className="container">
        <header className={r.head}>
          <h1>
            Hire better, <span className="gr">for free</span>
          </h1>
          <p>Guides, reports and tools for hiring in mobile games and apps.</p>
        </header>

        <ResourcesGate>
          {DOWNLOADS.map((d) => (
            <article key={d.file} className={r.feature}>
              <a href={d.file} target="_blank" rel="noopener" className={r.cover} aria-label={`Open ${d.title}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.cover} alt="" width={794} height={1123} />
              </a>
              <div className={r.featureBody}>
                <h2>{d.title}</h2>
                <p className={r.blurb}>{d.blurb}</p>
                <ul className={r.inside}>
                  {d.inside.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <div className={r.actions}>
                  <a href={d.file} target="_blank" rel="noopener" className={r.download}>
                    Download the guide
                  </a>
                  <span className={r.meta}>{d.meta}</span>
                </div>
              </div>
            </article>
          ))}

          <h2 className={r.section}>
            Free <span className="gr">tools</span>
          </h2>
          <div className={r.tools}>
            {TOOLS.map((t) => {
              const s = TOOL_STYLE[t.href];
              return (
                <Link key={t.href} href={t.href} className={r.tool}>
                  <span className={r.tab} style={{ background: s?.tone }}>{s?.icon}</span>
                  <strong>{t.title}</strong>
                  <p>{t.blurb}</p>
                  <em>Try it →</em>
                </Link>
              );
            })}
          </div>

          {guides.length > 0 && (
            <div className={styles.groups} style={{ marginTop: 72 }}>
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

          <div className={r.closing}>
            <p>
              More guides and reports <span className="gr">on the way.</span>
            </p>
          </div>
        </ResourcesGate>
      </div>
    </section>
  );
}
