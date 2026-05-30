"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/atoms/Button";
import styles from "./RosterCarousel.module.css";

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

export function RosterCarousel() {
  const [featured, setFeatured] = useState(Math.floor(PROFILES.length / 2));
  const [reduced, setReduced] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const hover = useRef(false);

  // Compute translate so the featured card centres in the stage.
  // Track has left: 0; track's left edge starts at the stage's left edge.
  // We shift the track right by (stageWidth/2 - featuredCenterFromTrackLeft)
  // so the featured card's centre lands exactly at stageWidth/2.
  const recenter = useCallback(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;
    const cards = cardRefs.current;
    const featuredCard = cards[featured];
    if (!featuredCard) return;

    let offsetFromTrackLeft = 0;
    for (let i = 0; i < featured; i++) {
      const c = cards[i];
      if (c) offsetFromTrackLeft += c.offsetWidth + 14; // gap = 14
    }
    const featuredCenter = offsetFromTrackLeft + featuredCard.offsetWidth / 2;
    const stageWidth = stage.offsetWidth;
    const target = stageWidth / 2 - featuredCenter;

    track.style.transform = `translate(${target}px, -50%)`;
  }, [featured]);

  // Reduced motion detection
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Recentre on featured change + on window resize
  useEffect(() => {
    recenter();
    if (typeof window === "undefined") return;
    window.addEventListener("resize", recenter);
    return () => window.removeEventListener("resize", recenter);
  }, [recenter]);

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

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <div>
          <p className="kicker">a look at the roster</p>
          <h2 className={styles.headline}>
            some of who&apos;s <span className="gr">on the bench.</span>
          </h2>
        </div>
        <p className={styles.intro}>
          The full roster filters by discipline, industry, channels, budget
          managed and more.
        </p>
      </div>

      <div
        ref={stageRef}
        className={styles.stage}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div ref={trackRef} className={styles.track}>
          {PROFILES.map((p, i) => {
            const isFeat = i === featured;
            const isAdj = Math.abs(i - featured) === 1;
            return (
              <div
                key={p.m}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={`${styles.pcard} ${isFeat ? styles.featured : ""} ${isAdj ? styles.adj : ""}`}
              >
                <div className={styles.top}>
                  <span className={styles.mono}>{p.m}</span>
                  <span className={`status ${p.av ? "available" : "contract"} ${isFeat ? styles.statusOnDark : ""}`}>
                    <span className="dot" />
                    {p.av ? "available" : "in contract"}
                  </span>
                </div>
                <div className={styles.mid}>
                  <h3 className={styles.name}>{p.name}</h3>
                  <p className={styles.role}>{p.role}</p>
                </div>
                <div className={styles.meta}>
                  <Row k="location" v={p.loc} />
                  <Row k="day rate" v={p.rate} />
                  <Row k={p.ctxLabel} v={p.ctx} />
                </div>
              </div>
            );
          })}
        </div>
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
          browse the full roster
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
