"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { money } from "@/lib/compare";
import { activePromo, dropsFor } from "@/lib/promos";
import type { Currency } from "@/lib/currency";
import styles from "./gift.module.css";

type Prize = { pct: number; rarity: string; color: string; code: string; expiresAt: string; used: boolean };

/* The offer box (Andre 2026-11-07). One mechanic, any skin (lib/promos):
   Christmas gift, Easter egg, Halloween pumpkin, Hump Day. Tap it, it spins
   up, slows down, bursts open: 5%, 10% or 15% off. The prize is drawn and
   kept on the server; opening starts the code's 24 hours. Hires needed by
   the special date get better odds plus priority search. The ⓘ shows the
   drop rates, like a mobile game. */
export function GiftBox({ lid, special, slots, cur = "GBP", fee = 9000 }: { lid: string; special: boolean; slots: number; cur?: Currency; fee?: number }) {
  const promo = activePromo();
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<"idle" | "spin" | "shake" | "burst" | "done" | "soldout">("idle");
  const [odds, setOdds] = useState(false);
  const [prize, setPrize] = useState<Prize | null>(null);
  const cube = useRef<HTMLDivElement>(null);
  if (!promo) return null;
  const tier = special ? promo.special : promo.standard;
  const priorityGone = special && slots <= 0;
  const skin = {
    ["--box" as string]: promo.colors.box,
    ["--boxDark" as string]: promo.colors.boxDark,
    ["--ribbon" as string]: promo.colors.ribbon,
  };

  // Opening the overlay: if the box was opened before, go straight to the prize.
  const show = async () => {
    setOpen(true);
    if (prize) return;
    const r = await fetch(`/api/compare/gift?lid=${lid}`).then((x) => x.json()).catch(() => null);
    if (r?.opened) {
      setPrize(r);
      setPhase("done");
    }
  };

  const unbox = () => {
    if (phase !== "idle") return;
    setPhase("spin");
    const claim = fetch("/api/compare/gift", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lid }) })
      .then((x) => x.json())
      .catch(() => null);
    let angle = 0;
    const t0 = performance.now();
    const UP = 1300, DOWN = 1500;
    const frame = (now: number) => {
      const t = now - t0;
      // Speeds up, then slows to a stop facing the front.
      const speed = t < UP ? 2 + 34 * (t / UP) ** 2 : Math.max(0, 36 * (1 - (t - UP) / DOWN) ** 2);
      angle += speed;
      const tilt = -18 + Math.sin(t / 90) * Math.min(speed, 20) * 0.4;
      if (cube.current) cube.current.style.transform = `rotateX(${tilt}deg) rotateY(${angle}deg)`;
      if (t < UP + DOWN) return void requestAnimationFrame(frame);
      const settle = Math.ceil(angle / 360) * 360 + 30;
      if (cube.current) {
        cube.current.style.transition = "transform 450ms cubic-bezier(.2,.9,.3,1.2)";
        cube.current.style.transform = `rotateX(-18deg) rotateY(${settle}deg)`;
      }
      claim.then((r) => {
        if (r?.soldOut) return setPhase("soldout");
        if (!r?.code) return setPhase("idle");
        setPrize(r);
        setTimeout(() => setPhase("shake"), 450);
        setTimeout(() => setPhase("burst"), 1150);
        setTimeout(() => setPhase("done"), 1900);
      });
    };
    requestAnimationFrame(frame);
  };

  const expired = prize ? Date.now() > Date.parse(prize.expiresAt) : false;
  const glow = prize?.color ?? promo.colors.glow;

  return (
    <>
      <div className={styles.teaser} style={skin}>
        <div className={styles.miniBox} aria-hidden="true">
          <span />
        </div>
        <div>
          <strong>{special ? `Your ${promo.name} pack` : `A ${promo.name} for you`}</strong>
          <p>
            {tier.teaser}
            {special && (priorityGone ? ` All ${promo.special.cap} priority slots are taken, but your box is still yours.` : ` Only ${slots} of ${promo.special.cap} priority slots left.`)}
          </p>
        </div>
        <button type="button" className={styles.openBtn} onClick={show}>
          {phase === "done" ? "See your gift" : `Open your ${promo.item}`}
        </button>
      </div>

      {open && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={`Your ${promo.name}`} style={skin}>
          <div className={styles.sheet} style={{ ["--glow" as string]: glow }}>
            <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Close">×</button>
            <button type="button" className={styles.info} onClick={() => setOdds(!odds)} aria-label="Drop rates">i</button>

            {odds && (
              <div className={styles.odds}>
                <strong>Drop rates{special ? " (priority pack)" : ""}</strong>
                {dropsFor(promo, special).map((d) => (
                  <div key={d.pct} className={styles.oddRow}>
                    <span style={{ color: d.color }}>{d.rarity}</span>
                    <span>{d.pct}% off</span>
                    <span>{d.odds}%</span>
                  </div>
                ))}
                <p>One {promo.item} per comparison. Off your first hire&apos;s fee when you book a search week{promo.until ? ` by ${new Date(promo.until).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}` : ""}.</p>
              </div>
            )}

            {phase === "soldout" ? (
              <div className={styles.reveal}>
                <span className={styles.prize}>Sold out</span>
                <p>All the priority slots have just been taken, sorry. You can still book a search week as normal.</p>
                <Link href="/start" className={styles.claim}>Book a search week →</Link>
              </div>
            ) : phase !== "done" ? (
              <>
                <p className={styles.tapHint}>{phase === "idle" ? `Tap the ${promo.item}` : phase === "burst" ? "!!!" : "…"}</p>
                <button type="button" className={`${styles.stage} ${phase === "shake" ? styles.shake : ""} ${phase === "burst" ? styles.bursting : ""}`} onClick={unbox} aria-label={`Open the ${promo.item}`}>
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
              prize && (
                <div className={styles.reveal}>
                  <span className={styles.rarity} style={{ color: prize.color }}>{prize.rarity}</span>
                  <span className={styles.prize}>{prize.pct}% off</span>
                  <p>your first hire: {money(fee * (1 - prize.pct / 100), cur)} instead of {money(fee, cur)}.</p>
                  <div className={styles.code}>{prize.code}</div>
                  {special && !priorityGone && (
                    <div className={styles.perk}>
                      <b>+ Priority search</b>
                      <span>{promo.special.perk}</span>
                    </div>
                  )}
                  <p className={styles.small}>
                    {prize.used
                      ? "You've used this code on your booking."
                      : expired
                        ? "This code has expired."
                        : `Valid until ${new Date(prize.expiresAt).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}. It's applied automatically when you book.`}
                  </p>
                  {!expired && !prize.used && <Link href={`/start?code=${prize.code}`} className={styles.claim}>Book a search week →</Link>}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}
