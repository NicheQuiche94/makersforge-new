"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DROPS, rollGift, gbp } from "@/lib/compare";
import styles from "./gift.module.css";

/* MOCKUP (Andre 2026-11-07): a pre-Christmas loot box. Tap it, it spins up,
   slows down, bursts open: 5%, 10% or 15% off a search week. The prize is
   fixed per comparison (seeded), and the code runs 24 hours from opening.
   The ⓘ shows the drop rates, like a mobile game would. */
export function GiftBox({ lid }: { lid: string }) {
  const prize = rollGift(lid);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<"idle" | "spin" | "shake" | "burst" | "done">("idle");
  const [odds, setOdds] = useState(false);
  const [openedAt, setOpenedAt] = useState<number | null>(null);
  const cube = useRef<HTMLDivElement>(null);
  const key = `mf-gift-${lid}`;

  useEffect(() => {
    try {
      const t = Number(localStorage.getItem(key));
      if (t) {
        setOpenedAt(t);
        setPhase("done");
      }
    } catch {}
  }, [key]);

  // Mockup only: replay the opening.
  const reset = () => {
    try {
      localStorage.removeItem(key);
    } catch {}
    setOpenedAt(null);
    setPhase("idle");
    if (cube.current) {
      cube.current.style.transition = "";
      cube.current.style.transform = "";
    }
  };

  const unbox = () => {
    if (phase !== "idle") return;
    setPhase("spin");
    let angle = 0;
    let tilt = -18;
    const t0 = performance.now();
    const UP = 1300, DOWN = 1500;
    const frame = (now: number) => {
      const t = now - t0;
      // Speeds up, then slows to a stop facing the front.
      const speed = t < UP ? 2 + 34 * (t / UP) ** 2 : Math.max(0, 36 * (1 - (t - UP) / DOWN) ** 2);
      angle += speed;
      tilt = -18 + Math.sin(t / 90) * Math.min(speed, 20) * 0.4;
      if (cube.current) cube.current.style.transform = `rotateX(${tilt}deg) rotateY(${angle}deg)`;
      if (t < UP + DOWN) return void requestAnimationFrame(frame);
      const settle = Math.ceil(angle / 360) * 360 + 30;
      if (cube.current) {
        cube.current.style.transition = "transform 450ms cubic-bezier(.2,.9,.3,1.2)";
        cube.current.style.transform = `rotateX(-18deg) rotateY(${settle}deg)`;
      }
      setTimeout(() => setPhase("shake"), 450);
      setTimeout(() => setPhase("burst"), 1150);
      setTimeout(() => {
        const now2 = Date.now();
        try {
          localStorage.setItem(key, String(now2));
        } catch {}
        setOpenedAt(now2);
        setPhase("done");
      }, 1900);
    };
    requestAnimationFrame(frame);
  };

  const expires = openedAt ? new Date(openedAt + 864e5) : null;
  const expired = expires ? Date.now() > expires.getTime() : false;
  const price = 12000 * (1 - prize.pct / 100);

  return (
    <>
      <div className={styles.teaser}>
        <div className={styles.miniBox} aria-hidden="true">
          <span />
        </div>
        <div>
          <strong>A pre-Christmas gift for you</strong>
          <p>Open it for money off a search week booked before Christmas.</p>
        </div>
        <button type="button" className={styles.openBtn} onClick={() => setOpen(true)}>
          {phase === "done" ? "See your gift" : "Open your Christmas gift"}
        </button>
      </div>

      {open && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Your Christmas gift">
          <div className={styles.sheet} style={{ ["--glow" as string]: prize.color }}>
            <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Close">×</button>
            <button type="button" className={styles.info} onClick={() => setOdds(!odds)} aria-label="Drop rates">i</button>

            {odds && (
              <div className={styles.odds}>
                <strong>Drop rates</strong>
                {DROPS.map((d) => (
                  <div key={d.pct} className={styles.oddRow}>
                    <span style={{ color: d.color }}>{d.rarity}</span>
                    <span>{d.pct}% off</span>
                    <span>{d.odds}%</span>
                  </div>
                ))}
                <p>One box per comparison. Off one search week booked before 24 December.</p>
              </div>
            )}

            {phase !== "done" ? (
              <>
                <p className={styles.tapHint}>{phase === "idle" ? "Tap the box" : phase === "burst" ? "!!!" : "…"}</p>
                <button type="button" className={`${styles.stage} ${phase === "shake" ? styles.shake : ""} ${phase === "burst" ? styles.bursting : ""}`} onClick={unbox} aria-label="Open the gift box">
                  <div className={styles.cube} ref={cube}>
                    <i className={`${styles.face} ${styles.front}`} />
                    <i className={`${styles.face} ${styles.back}`} />
                    <i className={`${styles.face} ${styles.right}`} />
                    <i className={`${styles.face} ${styles.left}`} />
                    <i className={`${styles.face} ${styles.bottom}`} />
                    <i className={`${styles.face} ${styles.top} ${phase === "burst" ? styles.lidOff : ""}`} />
                  </div>
                  <span className={styles.shadow} />
                  {phase === "burst" && <span className={styles.burst} />}
                </button>
              </>
            ) : (
              <div className={styles.reveal}>
                <span className={styles.rarity} style={{ color: prize.color }}>{prize.rarity}</span>
                <span className={styles.prize}>{prize.pct}% off</span>
                <p>
                  your search week: {gbp(price)} instead of {gbp(12000)}.
                </p>
                <div className={styles.code}>{prize.code}</div>
                <p className={styles.small}>
                  {expired
                    ? "This code has expired."
                    : `Valid until ${expires?.toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}. Enter it when you book.`}
                </p>
                {!expired && <Link href={`/start?code=${prize.code}`} className={styles.claim}>Book a search week →</Link>}
                <button type="button" className={styles.reset} onClick={reset}>
                  Mockup: reset the box
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
