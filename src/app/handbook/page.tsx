import type { Metadata } from "next";
import styles from "./handbook.module.css";

export const metadata: Metadata = {
  title: "The handbook · MakersForge",
  robots: { index: false, follow: false },
};

// The manuals live as self-contained branded HTML in /public/handbook. Ordered
// as an onboarding path, start at the top.
const MANUALS = [
  {
    n: "01",
    file: "systems-process-manual.html",
    title: "Systems & Process",
    sub: "Where everything lives",
    desc: "Start here. The tools, the workflows, and how every piece connects.",
  },
  {
    n: "02",
    file: "job-funnel-manual.html",
    title: "The Job Funnel",
    sub: "How the board feeds the business",
    desc: "How the job board turns into warm leads, placements and revenue.",
  },
  {
    n: "03",
    file: "cold-outreach-manual.html",
    title: "Cold Outreach",
    sub: "How we do it",
    desc: "The end-to-end playbook, who to contact, when, and exactly what to say.",
  },
  {
    n: "04",
    file: "affiliate-program-manual.html",
    title: "Affiliate Program",
    sub: "Partner growth manual",
    desc: "How the partner and affiliate growth engine works, and how to run it.",
  },
];

export default function HandbookPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.hero}>
          <p className={styles.kicker}>MakersForge · Team</p>
          <h1 className={styles.title}>The handbook</h1>
          <p className={styles.intro}>
            Everything you need to run your desk, the systems, the funnel, and
            the playbooks. Work through them top to bottom, then keep them close.
            Bookmark this page; it&apos;s only for you.
          </p>
        </header>

        <div className={styles.grid}>
          {MANUALS.map((m) => (
            <a key={m.file} href={`/handbook/${m.file}`} className={styles.card}>
              <span className={styles.num}>{m.n}</span>
              <span className={styles.cardTitle}>{m.title}</span>
              <span className={styles.cardSub}>{m.sub}</span>
              <span className={styles.cardDesc}>{m.desc}</span>
              <span className={styles.open} aria-hidden="true">
                Open manual →
              </span>
            </a>
          ))}
        </div>

        <p className={styles.kicker} style={{ margin: "44px 0 16px" }}>
          Also in here
        </p>
        <div className={styles.grid}>
          <a href="/handbook/job-specs" className={styles.card}>
            <span className={styles.num}>📁</span>
            <span className={styles.cardTitle}>Job specs</span>
            <span className={styles.cardSub}>Role briefs by client</span>
            <span className={styles.cardDesc}>
              Every live and upcoming role brief, filed in a folder per client.
              Read the full spec before you reach out or represent it.
            </span>
            <span className={styles.open} aria-hidden="true">
              Open folder →
            </span>
          </a>
        </div>

        <p className={styles.footnote}>
          Private to the MakersForge team. Please don&apos;t share the link or
          the password.
        </p>
      </div>
    </div>
  );
}
