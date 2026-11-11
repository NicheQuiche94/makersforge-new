"use client";

/**
 * What's Appening motion (2026-11-10):
 *  - NotificationStack: lock-screen style notifications that drop in one by
 *    one, stack, then cycle. The name is a pun on "what's happening", so the
 *    hero shows exactly that: new things arriving.
 *  - Trailer: a YouTube/Vimeo poster that only loads the player on click.
 * Both respect prefers-reduced-motion (handled in CSS).
 */
import { useEffect, useState } from "react";
import styles from "./appening.module.css";

export type Note = { icon?: string | null; title: string; body: string; when: string };

export function NotificationStack({ notes }: { notes: Note[] }) {
  // `shown` counts notifications delivered so far. We render one extra card
  // waiting above the stack (depth -1, invisible) and one leaving below it
  // (depth 3, fading out), so every card only ever glides to its next slot:
  // no card appears or vanishes abruptly.
  const [shown, setShown] = useState(3);
  useEffect(() => {
    if (notes.length < 2) return;
    const t = setInterval(() => setShown((n) => n + 1), 3200);
    return () => clearInterval(t);
  }, [notes.length]);
  const keys = Array.from({ length: 5 }, (_, i) => shown - 4 + i).filter((k) => k >= 0);
  return (
    <div className={styles.stack} aria-hidden="true">
      {keys.map((k) => {
        const n = notes[k % notes.length];
        const depth = shown - 1 - k; // -1 waiting, 0 newest … 3 leaving
        return (
          <div key={k} className={styles.note} data-depth={depth} style={{ ["--d" as string]: depth }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {n.icon ? <img src={n.icon} alt="" /> : <span className={styles.noteMark}>A</span>}
            <div>
              <p className={styles.noteTop}>
                <b>{n.title}</b>
                <span>{n.when}</span>
              </p>
              <p className={styles.noteBody}>{n.body}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function trailerEmbed(url: string | null | undefined): { embed: string; poster: string | null } | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { embed: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0`, poster: `https://i.ytimg.com/vi/${yt[1]}/hqdefault.jpg` };
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { embed: `https://player.vimeo.com/video/${vm[1]}?autoplay=1`, poster: null };
  return null;
}

export function Trailer({ url, name }: { url: string; name: string }) {
  const [play, setPlay] = useState(false);
  const t = trailerEmbed(url);
  if (!t) return null;
  return (
    <div className={styles.trailer}>
      {play ? (
        <iframe src={t.embed} title={`${name} trailer`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
      ) : (
        <button type="button" onClick={() => setPlay(true)} aria-label={`Play the ${name} trailer`} style={t.poster ? { backgroundImage: `url(${t.poster})` } : undefined}>
          <span>▶</span>
        </button>
      )}
    </div>
  );
}
