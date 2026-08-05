import type { Metadata } from "next";
import Link from "next/link";
import { SPEC_CLIENTS } from "@/data/job-specs";
import styles from "./jobspecs.module.css";

export const metadata: Metadata = {
  title: "Job specs · MakersForge Handbook",
  robots: { index: false, follow: false },
};

export default function JobSpecsHubPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/handbook">Handbook</Link>
          <span className={styles.crumbSep}>/</span>
          <span className={styles.crumbHere}>Job specs</span>
        </nav>

        <header className={styles.hero}>
          <p className={styles.kicker}>MakersForge · Team</p>
          <h1 className={styles.title}>Job specs</h1>
          <p className={styles.intro}>
            Every live and upcoming role brief, filed by client. Open a folder
            to read the full spec before you reach out or represent it.
          </p>
        </header>

        <div className={styles.grid}>
          {SPEC_CLIENTS.map((c) => (
            <Link
              key={c.slug}
              href={`/handbook/job-specs/${c.slug}`}
              className={styles.folder}
            >
              <span className={styles.folderIcon} aria-hidden="true">
                📁
              </span>
              <span className={styles.folderName}>{c.name}</span>
              {c.blurb && <span className={styles.folderBlurb}>{c.blurb}</span>}
              <span className={styles.folderCount}>
                {c.specs.length === 0
                  ? "No specs yet →"
                  : `${c.specs.length} spec${c.specs.length === 1 ? "" : "s"} →`}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
