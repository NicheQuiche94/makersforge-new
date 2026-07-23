import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import styles from "./standard.module.css";

export const metadata: Metadata = {
  title: "The Fair Board Standard: how we do transparency | MakersForge",
  description:
    "How the MakersForge job board handles pay, contract and hours transparency: where roles come from, exactly what we infer and how, and what we refuse to claim. Sourced vs employer-verified listings explained.",
  alternates: { canonical: "/jobs/standard" },
};

export default function StandardPage() {
  return (
    <div className={styles.page}>
      <div className="jobs-wrap">
        <header className={styles.hero}>
          <p className="kicker">Fair Board Standard</p>
          <h1 className={styles.title}>How we do transparency</h1>
          <p className={styles.intro}>
            Most job boards show whatever the employer&apos;s marketing wrote. We
            hold every listing to one standard: state the pay, the contract, the
            hours and what &ldquo;remote&rdquo; actually means, and where
            something isn&apos;t stated, say so out loud instead of leaving a
            flattering blank. Here is exactly how we do it, in full.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionH}>Where these roles come from</h2>
          <div className={styles.kinds}>
            <article className={styles.kind}>
              <span className={`${styles.kindTag} ${styles.kindSourced}`}>
                Sourced
              </span>
              <p>
                Pulled from a company&apos;s public careers page or applicant
                tracking system. They never asked to be here, so we never score
                them or imply they chose to hide anything. Anything a posting
                doesn&apos;t state reads &ldquo;Not stated&rdquo; (a fact about
                the posting, not a charge), and we invite the employer to claim
                the listing and complete it.
              </p>
            </article>
            <article className={styles.kind}>
              <span className={`${styles.kindTag} ${styles.kindVerified}`}>
                Employer-verified
              </span>
              <p>
                The employer posted the role here, or claimed a sourced one and
                confirmed the details. Only these carry a disclosure score and
                can earn the &ldquo;Fully transparent&rdquo; badge, because only
                these opted into being held to the standard.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionH}>What we show</h2>
          <div className={styles.prose}>
            <p>
              For every role we surface <strong>pay</strong>,{" "}
              <strong>contract</strong>, <strong>weekly hours</strong> and, for
              remote roles, <strong>remote scope</strong>. Each is one of three
              things, never hidden:
            </p>
            <p>
              <strong>Disclosed</strong>: stated, shown as-is.{" "}
              <strong>Not disclosed / Not stated</strong>: shown honestly.{" "}
              <strong>Not applicable</strong>: for example, remote scope on an
              on-site role.
            </p>
            <p>
              Whether you can hold a <strong>second job</strong> shows only when
              a role positively states it. Its absence is never counted against a
              role, because almost no advert addresses it. Presence is a plus;
              absence is nothing.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionH}>What we infer, and how</h2>
          <div className={styles.prose}>
            <p>
              We read what a public posting states, conservatively. Where we go
              beyond the literal words, here is exactly how, and why:
            </p>
          </div>
          <div className={styles.rules}>
            <div className={styles.rule}>
              <p className={styles.ruleH}>
                <span className={styles.heat}>Full-time</span> comes from the
                structured job type
              </p>
              <p>
                It&apos;s the applicant tracking system&apos;s own field, the same
                one the role&apos;s header shows. We never invent an hours number
                from it.
              </p>
            </div>
            <div className={styles.rule}>
              <p className={styles.ruleH}>
                <span className={styles.heat}>Permanent</span> is inferred from
                employee benefits
              </p>
              <p>
                Only when a role is full-time, lists real employee benefits
                (equity, 401(k), pension, parental leave, insurance) and states
                no fixed term. Benefits are employee-only: contractors and short
                fixed-terms don&apos;t get them, and a fixed-term role has to
                state its term. It&apos;s flagged internally as inferred, and only
                ever applied to sourced roles, never to employer-verified ones.
              </p>
            </div>
            <div className={styles.rule}>
              <p className={styles.ruleH}>
                <span className={styles.heat}>Remote scope</span> and{" "}
                <span className={styles.heat}>in-office days</span> come from the
                posting
              </p>
              <p>
                One country, a region or timezone band, or worldwide, and how
                many days a week in the office, read straight from what the role
                states.
              </p>
            </div>
            <div className={styles.rule}>
              <p className={styles.ruleH}>
                <span className={styles.heat}>Pay, contract length, hours</span>{" "}
                are read only when unambiguous
              </p>
              <p>
                A wrong disclosed value is worse than an honest blank, so we err
                toward &ldquo;not stated&rdquo; whenever the posting is unclear.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionH}>What we won&apos;t claim</h2>
          <div className={styles.prose}>
            <p>
              Restraint is the point. We only put something on the board if we
              can hold an employer to it.
            </p>
            <p>
              <strong>No &ldquo;crunch-free&rdquo; claims.</strong> A company can
              say it and crunch anyway, and we can&apos;t hold it to account, so
              it isn&apos;t a dimension.{" "}
              <strong>We don&apos;t score sourced roles</strong>, because they
              never opted in. <strong>We never invent numbers</strong>, and we
              never read a company&apos;s benefits blurb as a promise it
              didn&apos;t make.
            </p>
          </div>
        </section>

        <div className={styles.callout}>
          <h2 className={styles.calloutH}>Hiring? Get your listing verified.</h2>
          <p className={styles.calloutBody}>
            Post a role, or claim one we&apos;ve sourced, and confirm the pay,
            contract and hours. Once we&apos;ve checked it&apos;s you, the role
            shows as employer-verified, with a disclosure score and, at full
            disclosure, the &ldquo;Fully transparent&rdquo; badge.
          </p>
          <div className={styles.actions}>
            <Button href="/jobs/post" variant="primary" arrow>
              Post a role
            </Button>
            <Button href="/jobs" variant="ghost">
              Back to the board
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
