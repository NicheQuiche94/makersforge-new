import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORY_SHORT } from "@/lib/jobs";
import { CONTRACT_LABELS, formatPay } from "@/lib/terms";
import { getTalentMatches, getMatchStats } from "@/lib/matches";
import styles from "./matches.module.css";

// Internal outreach tool — never indexed. Roster is anonymised (codenames), so
// no real identities are exposed, but keep it out of search anyway.
export const metadata: Metadata = {
  title: "Talent matches (internal)",
  robots: { index: false, follow: false },
};

export default function MatchesPage() {
  const groups = getTalentMatches();
  const stats = getMatchStats();

  return (
    <div className={styles.page}>
      <div className="jobs-wrap">
        <header className={styles.head}>
          <p className="kicker">Internal · outreach</p>
          <h1 className={styles.title}>Talent matches</h1>
          <p className={styles.sub}>
            Live board roles that are a strong fit for available talent.{" "}
            <strong>{stats.talent}</strong> talent matched to{" "}
            <strong>{stats.roles}</strong> role
            {stats.roles === 1 ? "" : "s"}
            {stats.newRoles > 0 ? (
              <>
                {" "}
                (<strong>{stats.newRoles}</strong> new this week)
              </>
            ) : null}
            .
          </p>
        </header>

        {groups.length === 0 ? (
          <p className={styles.empty}>
            No strong matches right now. As new roles land or talent joins,
            they&apos;ll show here.
          </p>
        ) : (
          groups.map(({ profile, matches }) => (
            <section key={profile.id} className={styles.talent}>
              <div className={styles.talentHead}>
                <span className={styles.code}>{profile.codename}</span>
                <span className={styles.role}>{profile.role}</span>
                <span className={styles.disc}>{profile.discipline}</span>
                <span className={styles.meta}>{profile.location.label}</span>
                <span className={styles.meta}>· {profile.dayRateLabel}</span>
                <span className={styles.count}>
                  {matches.length} role{matches.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className={styles.roles}>
                {matches.map(({ job, note, isNew }) => {
                  const pay = formatPay(job.terms?.pay);
                  const contract = job.terms?.contract?.type;
                  return (
                    <div key={job.slug} className={styles.roleRow}>
                      <div className={styles.roleMain}>
                        <Link
                          href={`/jobs/${job.slug}`}
                          className={styles.roleTitle}
                        >
                          {job.title}
                        </Link>
                        <div className={styles.roleMeta}>
                          <span className={styles.company}>
                            {job.company.name}
                          </span>
                          <span>{CATEGORY_SHORT[job.category]}</span>
                          {pay && <span className={styles.pay}>{pay}</span>}
                          {contract && <span>{CONTRACT_LABELS[contract]}</span>}
                          {note && (
                            <span className={styles.fitNote}>{note}</span>
                          )}
                        </div>
                      </div>
                      {isNew && <span className={styles.new}>New</span>}
                      <Link
                        href={`/jobs/${job.slug}`}
                        className={styles.viewLink}
                      >
                        View →
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
