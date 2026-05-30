"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Button } from "@/components/atoms/Button";
import { Logo } from "@/components/atoms/Logo";
import styles from "./RosterCarousel.module.css";

/**
 * RosterCarousel — homepage preview of the bench.
 *
 * v2 (per Andre's punch list 2026-05-30): always show FIVE cards
 * visible — two on the left of the featured card, the featured one
 * centred, and two on the right. The carousel feels endless because
 * a profile is always sitting in every slot, no matter where the
 * featured index is in the list (modulo wrap fills the edges).
 *
 * Implementation:
 *   - Each profile renders with a CSS variable --slot computed from
 *     its distance to the featured index, wrapped modulo PROFILES.length
 *     into the range [-half, +half].
 *   - Slots -2, -1, 0, +1, +2 render visibly with scale + opacity
 *     decreasing with distance. Slots beyond ±2 are pushed off-screen
 *     and faded out.
 *   - Auto-cycle advances featured by 1 every CYCLE_MS; modulo wrap
 *     keeps the cycle infinite. Reduced-motion users get no auto-
 *     advance and can navigate via dots.
 */

type Profile = {
  m: string;
  name: string;
  role: string;
  loc: string;
  rate: string;
  ctx: string;
  ctxLabel: "budget" | "formats";
  av: boolean;
};

const PROFILES: Profile[] = [
  { m: "ua·101", name: "senior ua manager", role: "ex-supercell · games + apps", loc: "uk · remote", rate: "£600–750", ctx: "£1m+/mo managed", ctxLabel: "budget", av: true },
  { m: "art·204", name: "perf. creative lead", role: "ex-calm · apps", loc: "eu remote", rate: "£500–650", ctx: "video · ugc · static", ctxLabel: "formats", av: true },
  { m: "ua·114", name: "head of ua", role: "ex-rovio · games", loc: "helsinki", rate: "£700–850", ctx: "£1m+/mo managed", ctxLabel: "budget", av: false },
  { m: "art·211", name: "senior motion designer", role: "ex-king · games", loc: "lisbon", rate: "£450–550", ctx: "motion · playables", ctxLabel: "formats", av: true },
  { m: "ua·108", name: "ua director", role: "ex-duolingo · apps", loc: "tel aviv", rate: "£700–850", ctx: "£1m+/mo managed", ctxLabel: "budget", av: true },
  { m: "art·218", name: "art director", role: "ex-voodoo · games", loc: "warsaw", rate: "£600–750", ctx: "static · ugc", ctxLabel: "formats", av: false },
  { m: "ua·130", name: "lead ua manager", role: "ex-peak · games", loc: "uk", rate: "£500–650", ctx: "£250k–1m managed", ctxLabel: "budget", av: true },
];

const CYCLE_MS = 3200;

/** Wrap an integer `n` into the half-open range [-halfLen, +halfLen). */
function wrapSlot(n: number, len: number): number {
  const half = Math.floor(len / 2);
  const mod = ((n + half) % len + len) % len - half;
  return mod;
}

export function RosterCarousel() {
  const [featured, setFeatured] = useState(0);
  const [reduced, setReduced] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const hover = useRef(false);

  // Reduced motion detection
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Auto-cycle (skipped under reduced motion)
  useEffect(() => {
    if (reduced) return;
    const tick = () => {
      if (hover.current) return;
      setFeatured((i) => (i + 1) % PROFILES.length);
    };
    timer.current = setInterval(tick, CYCLE_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [reduced]);

  const onMouseEnter = () => {
    hover.current = true;
  };
  const onMouseLeave = () => {
    hover.current = false;
  };

  const jumpTo = (i: number) => {
    setFeatured(i);
    if (timer.current) clearInterval(timer.current);
    if (!reduced) {
      timer.current = setInterval(() => {
        if (!hover.current) setFeatured((x) => (x + 1) % PROFILES.length);
      }, CYCLE_MS);
    }
  };

  // Per-profile slot. Slot 0 is the featured (centre); ±1 adjacent;
  // ±2 far adjacent; |slot| > 2 is off-screen.
  const cards = useMemo(() => {
    return PROFILES.map((p, i) => ({
      profile: p,
      slot: wrapSlot(i - featured, PROFILES.length),
    }));
  }, [featured]);

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <div>
          <p className="kicker">a look at the lineup</p>
          <h2 className={styles.headline}>
            some of who&apos;s <span className="gr">on the lineup.</span>
          </h2>
        </div>
        <p className={styles.intro}>
          The full lineup filters by discipline, industry, channels, budget
          managed and more.
        </p>
      </div>

      <div
        className={styles.stage}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {cards.map(({ profile, slot }) => {
          const abs = Math.abs(slot);
          const isFeat = slot === 0;
          const isAdj = abs === 1;
          const isFar = abs === 2;
          const offScreen = abs > 2;
          return (
            <div
              key={profile.m}
              className={`${styles.pcard} ${
                isFeat ? styles.featured : ""
              } ${isAdj ? styles.adj : ""} ${isFar ? styles.far : ""} ${
                offScreen ? styles.off : ""
              }`}
              style={
                {
                  "--slot": slot,
                } as React.CSSProperties
              }
              aria-hidden={offScreen}
            >
              <div className={styles.top}>
                <span className={styles.mono}>{profile.m}</span>
                <span
                  className={`status ${profile.av ? "available" : "contract"} ${
                    isFeat ? styles.statusOnDark : ""
                  }`}
                >
                  <span className="dot" />
                  {profile.av ? "available" : "in contract"}
                </span>
              </div>
              <div className={styles.mid}>
                <h3 className={styles.name}>{profile.name}</h3>
                <p className={styles.role}>{profile.role}</p>
              </div>
              <div className={styles.meta}>
                <Row k="location" v={profile.loc} />
                <Row k="day rate" v={profile.rate} />
                <Row k={profile.ctxLabel} v={profile.ctx} />
              </div>
              {/* Brand stamp — small MakersForge mark in bottom-right
                  of every card. currentColor inheritance lets it pick
                  up the card's text color automatically, so it reads
                  dark on paper and white on the heat-gradient
                  featured card. */}
              <Logo
                variant="mark"
                size={18}
                monochrome="currentColor"
                className={styles.brandStamp}
                title=""
              />
            </div>
          );
        })}
      </div>

      <div className={styles.dots} role="tablist" aria-label="Roster preview">
        {PROFILES.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === featured}
            aria-label={`Show profile ${i + 1}`}
            className={`${styles.dot} ${i === featured ? styles.dotOn : ""}`}
            onClick={() => jumpTo(i)}
          />
        ))}
      </div>

      <div className={styles.cta}>
        <Button href="/roster" variant="primary" arrow>
          browse the full lineup
        </Button>
      </div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className={styles.row}>
      <span className={styles.k}>{k}</span>
      <span className={styles.v}>{v}</span>
    </div>
  );
}
