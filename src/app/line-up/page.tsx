import type { Metadata } from "next";
import { RosterHero } from "@/components/sections/RosterHero";
import { TalentDirectoryApp } from "@/components/sections/TalentDirectoryApp";
import Link from "next/link";
import { BOOKING_URL } from "@/lib/site";
import styles from "./lineup.module.css";

export const metadata: Metadata = {
  title: "Talent directory · MakersForge",
  description:
    "Mobile games and app specialists we've personally interviewed: growth and UA, art, product and more. Profiles anonymised; we make the intro after a brief.",
};

/* 2026-10-27: the lineup became the MakersForge Talent Directory — the bench
   behind the "5 candidates in 5 working days" promise. Job-board-style rows
   with a Spotify-style discipline picker (TalentDirectoryApp) replace the
   old card grid + live strip. The bottom CTA sends anyone who doesn't see a
   fit to the brief: we search all 250, not just the public profiles. */
export default function RosterPage() {
  return (
    <>
      <RosterHero />
      <TalentDirectoryApp />
      {/* 2026-11-25 style pass. DRAFT copy for Andre: replaces the retired "3 matching profiles, free" offer. */}
      <section className={styles.closeWrap}>
        <div className="container">
          <div className={styles.close}>
            <h2>
              Don&apos;t see the <span className="gr">right person?</span>
            </h2>
            <p>
              These are only the people who&apos;ve opted in to a public profile. Brief us and we&apos;ll go direct
              to everyone who fits the role, not just the people listed here.
            </p>
            <div className={styles.actions}>
              <Link href="/start" className={styles.primary}>
                <span>Get started →</span>
              </Link>
              <a href={BOOKING_URL} target="_blank" rel="noreferrer" className={styles.secondary}>
                Book a 15-minute call →
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
