"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import styles from "./RosterPreview.module.css";

type Discipline = "all" | "ua" | "art";

type PreviewProfile = {
  m: string;
  role: string;
  background: string;
  available: boolean;
  discipline: "ua" | "art";
  location: string;
  rate: string;
  ctx: string;
  ctxLabel: "budget" | "formats";
};

const PROFILES: PreviewProfile[] = [
  { m: "ua·101", role: "senior ua manager", background: "ex-supercell", available: true, discipline: "ua", location: "uk", rate: "£600–750", ctx: "£1m+/mo", ctxLabel: "budget" },
  { m: "art·204", role: "perf. creative lead", background: "ex-calm", available: true, discipline: "art", location: "eu remote", rate: "£500–650", ctx: "video · ugc", ctxLabel: "formats" },
  { m: "ua·114", role: "head of ua", background: "ex-rovio", available: false, discipline: "ua", location: "helsinki", rate: "£700–850", ctx: "£1m+/mo", ctxLabel: "budget" },
  { m: "art·211", role: "senior motion designer", background: "ex-king", available: true, discipline: "art", location: "lisbon", rate: "£450–550", ctx: "motion · video", ctxLabel: "formats" },
  { m: "ua·108", role: "ua director", background: "ex-duolingo", available: true, discipline: "ua", location: "tel aviv", rate: "£700–850", ctx: "£1m+/mo", ctxLabel: "budget" },
  { m: "art·218", role: "art director", background: "ex-voodoo", available: false, discipline: "art", location: "warsaw", rate: "£600–750", ctx: "static · playables", ctxLabel: "formats" },
];

const DISCIPLINE_LABELS: Record<Discipline, string> = {
  all: "all",
  ua: "ua managers",
  art: "marketing artists",
};

export function RosterPreview() {
  const [active, setActive] = useState<Discipline>("all");
  const visible = PROFILES.filter((p) => active === "all" || p.discipline === active).slice(0, 6);

  return (
    <section className={styles.preview} id="preview">
      <div className="container">
        <div className={`scroll-reveal ${styles.top}`}>
          <div>
            <p className="kicker kicker-mute">a look at the roster</p>
            <h2 className={`display-section ${styles.headline}`}>
              some of who&apos;s <span className="gr">on the bench.</span>
            </h2>
          </div>
          <p className={styles.intro}>
            The full roster filters by discipline, industry, channels, budget
            managed and more.
          </p>
        </div>

        <div className={styles.toggle} role="tablist" aria-label="Filter by discipline">
          {(Object.keys(DISCIPLINE_LABELS) as Discipline[]).map((d) => (
            <button
              key={d}
              type="button"
              role="tab"
              aria-selected={active === d}
              className={`${styles.chip} ${active === d ? styles.chipActive : ""}`}
              onClick={() => setActive(d)}
            >
              {DISCIPLINE_LABELS[d]}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {visible.map((p) => (
            <Link key={p.m} href="/roster" className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.mono}>{p.m}</span>
                <span className={`status ${p.available ? "available" : "contract"}`}>
                  <span className="dot" />
                  {p.available ? "available" : "in contract"}
                </span>
              </div>
              <h3 className={styles.role}>{p.role}</h3>
              <p className={styles.background}>{p.background}</p>
              <div className={styles.meta}>
                <div className={styles.metaRow}>
                  <span className={styles.k}>location</span>
                  <span className={styles.v}>{p.location}</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.k}>day rate</span>
                  <span className={styles.v}>{p.rate}</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.k}>{p.ctxLabel}</span>
                  <span className={styles.v}>{p.ctx}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.cta}>
          <Button href="/roster" variant="outline" arrow>
            browse the full roster
          </Button>
        </div>
      </div>
    </section>
  );
}
