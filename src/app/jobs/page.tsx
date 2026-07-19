import type { Metadata } from "next";
import Link from "next/link";
import {
  getLiveJobs,
  getActiveRegions,
  getActiveSizeBuckets,
  getActiveStages,
  getJobStats,
} from "@/lib/jobs";
import { JobsBoard } from "@/components/jobs/JobsBoard";
import { StatBar } from "@/components/jobs/StatBar";
import { AlertForm } from "@/components/jobs/AlertForm";
import { TalentAlertForm } from "@/components/jobs/TalentAlertForm";
import { FaqSection } from "@/components/seo/FaqSection";
import styles from "./jobs.module.css";

const JOBS_FAQ = [
  {
    q: "What is the MakersForge job board?",
    a: "It is a hand-curated job board dedicated to user acquisition, growth and marketing-art roles in mobile games and consumer apps. Every role is checked for relevance before it goes live, and the board is updated weekly.",
  },
  {
    q: "What kinds of roles are on the board?",
    a: "UA managers, growth managers, performance marketers, ASO managers, marketing artists, motion designers and creative producers, at game studios and consumer app companies.",
  },
  {
    q: "Is it free to post a role?",
    a: "Yes. Hiring teams can post a role for free. If it does not fill, MakersForge can introduce vetted UA and marketing-art talent from its line-up.",
  },
  {
    q: "Who is the job board for?",
    a: "Both sides of the market: people looking for growth and marketing roles in mobile, and the studios and app companies hiring for them.",
  },
  {
    q: "How often is it updated?",
    a: "Weekly. New in-remit roles are added regularly, and you can set an email alert for your categories so you never miss one.",
  },
  {
    q: "Where are the roles based?",
    a: "Across EMEA and beyond, including fully remote roles, with a focus on mobile games and consumer app companies.",
  },
];

export const metadata: Metadata = {
  title:
    "UA, Growth & Marketing Art Jobs in Games & Apps | MakersForge",
  description:
    "The only job board exclusively for user acquisition, growth and marketing-art roles in games and consumer apps. Hand-curated, updated weekly.",
  alternates: { canonical: "/jobs" },
};

export default function JobsPage() {
  const jobs = getLiveJobs();
  const regions = getActiveRegions();
  const sizes = getActiveSizeBuckets();
  const stages = getActiveStages();
  const stats = getJobStats();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="jobs-wrap">
          <p className="kicker">The board</p>
          <h1 className={styles.heroH}>Growth team roles in apps and games</h1>
          <p className={styles.heroSub}>
            User acquisition, growth and marketing art roles at game studios and
            consumer app companies, updated weekly.
          </p>
        </div>
      </section>

      <section className={styles.body}>
        <div className={`jobs-wrap ${styles.statWrap}`}>
          <StatBar stats={stats} />
        </div>

        {/* Full-width post-a-role ad bar between the stats and the filter.
            Free posting is the wedge: every poster is a warm hiring-side
            lead, and if the role doesn't fill we place one of ours. */}
        <div className={`jobs-wrap ${styles.adWrap}`}>
          <Link href="/jobs/post" className={`heat-glow ${styles.adBar}`}>
            <span className={styles.adBarText}>
              <strong>Hiring for growth?</strong> Post a role free, in front of
              the right people.
            </span>
            <span className={styles.adBarCta}>
              Post a role, free <span aria-hidden="true">→</span>
            </span>
          </Link>
        </div>

        <div className="jobs-wrap">
          <JobsBoard
            jobs={jobs}
            regions={regions}
            sizes={sizes}
            stages={stages}
          />
        </div>
      </section>

      {/* Two-sided alerts: candidates get role alerts, hiring teams get
          told when matching talent joins (the reverse alert). Every
          talent-side submission is a warm hiring lead. */}
      <section className={styles.alertStrip}>
        <div className="jobs-wrap">
          <div className={styles.alertPair}>
            <div className={`${styles.alertCard} ${styles.fillDark}`}>
              <div className={styles.alertContent}>
                <div className={styles.alertCopy}>
                  <p className="kicker">For candidates</p>
                  <h2 className={styles.alertH}>
                    Never miss a role in your lane
                  </h2>
                  <p className={styles.alertSub}>
                    Pick your categories and we&apos;ll email you when something
                    new and in-remit lands.
                  </p>
                </div>
                <AlertForm
                  source="board-strip"
                  hideHeader
                  variant="dark"
                  bare
                />
              </div>
            </div>

            <div className={`heat-glow ${styles.alertCard}`}>
              <div className={styles.alertContent}>
                <div className={styles.alertCopy}>
                  <p className="kicker">For hiring teams</p>
                  <h2 className={styles.alertH}>Get first pick of new talent</h2>
                  <p className={styles.alertSub}>
                    Describe who you&apos;re after and we&apos;ll tell you the
                    moment someone matching joins the line-up.
                  </p>
                </div>
                <TalentAlertForm
                  source="talent-board-strip"
                  variant="dark"
                  bare
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <FaqSection
        heading="Questions about the board"
        items={JOBS_FAQ}
      />
    </div>
  );
}
