"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ROSTER, type Profile } from "@/data/roster";
import styles from "./TalentDirectoryApp.module.css";

/**
 * MakersForge Talent Directory (2026-10-27) — replaces the lineup card grid.
 * Job-board-style rows (one scannable line per person) under a Spotify
 * "browse genres" style discipline picker: big colourful tiles, tap one or
 * several to filter. Everything filters instantly on the client.
 *
 * Honest framing: 371 specialists interviewed; only those who've opted in to
 * a public profile appear here (the list grows as consent comes in).
 */

const INTERVIEWED = 371;

type Disc = Profile["discipline"];
const DISCIPLINES: Record<string, { label: string; tone: string }> = {
  ua: { label: "Growth & UA", tone: "heat" },
  creative: { label: "Art & creative", tone: "violet" },
  aso: { label: "ASO", tone: "teal" },
  product: { label: "Product & monetisation", tone: "blue" },
  design: { label: "Design", tone: "pink" },
  engineering: { label: "Engineering", tone: "green" },
  data: { label: "Data", tone: "amber" },
};

const initials = (p: Profile) => p.codename.split(/[·.\s-]/)[0].slice(0, 2).toUpperCase();

export function TalentDirectoryApp() {
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState<"all" | "games" | "apps">("all");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [type, setType] = useState<"any" | "contract" | "permanent">("any");

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of ROSTER) c[p.discipline] = (c[p.discipline] || 0) + 1;
    return c;
  }, []);
  const tiles = Object.keys(DISCIPLINES).filter((d) => counts[d]);

  const toggle = (d: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ROSTER.filter((p) => {
      if (picked.size && !picked.has(p.discipline)) return false;
      if (sector !== "all" && !p.industries.includes(sector)) return false;
      if (availableOnly && !p.available) return false;
      if (type !== "any" && !p.availableFor.includes(type)) return false;
      if (!q) return true;
      const hay = [p.role, p.background, p.location.label, ...(p.skills || [])].join(" ").toLowerCase();
      return hay.includes(q);
    }).sort((a, b) => Number(b.available) - Number(a.available));
  }, [picked, query, sector, availableOnly, type]);

  const available = ROSTER.filter((p) => p.available).length;
  const anyFilter = picked.size || query || sector !== "all" || availableOnly || type !== "any";
  const reset = () => {
    setPicked(new Set());
    setQuery("");
    setSector("all");
    setAvailableOnly(false);
    setType("any");
  };

  return (
    <section className={styles.section}>
      <div className="container">
        <p className={styles.honest}>
          <strong>{INTERVIEWED}</strong> specialists interviewed by us ·{" "}
          <strong>{ROSTER.length}</strong> with a public profile ·{" "}
          <strong>{available}</strong> available now
        </p>

        {/* Discipline picker — Spotify "browse all" style tiles */}
        <div className={styles.tiles} role="group" aria-label="Filter by discipline">
          <button
            type="button"
            className={`${styles.tile} ${styles.toneInk} ${picked.size === 0 ? styles.tileOn : ""}`}
            aria-pressed={picked.size === 0}
            onClick={() => setPicked(new Set())}
          >
            <span className={styles.tileLabel}>Everyone</span>
            <span className={styles.tileCount}>{ROSTER.length} profiles</span>
            <span className={styles.tileShape} aria-hidden="true" />
          </button>
          {tiles.map((d) => {
            const on = picked.has(d);
            return (
              <button
                key={d}
                type="button"
                className={`${styles.tile} ${styles[`tone_${DISCIPLINES[d].tone}`]} ${on ? styles.tileOn : ""}`}
                aria-pressed={on}
                onClick={() => toggle(d)}
              >
                <span className={styles.tileLabel}>{DISCIPLINES[d].label}</span>
                <span className={styles.tileCount}>
                  {counts[d]} {counts[d] === 1 ? "profile" : "profiles"}
                </span>
                {on ? <span className={styles.tileCheck} aria-hidden="true">✓</span> : null}
                <span className={styles.tileShape} aria-hidden="true" />
              </button>
            );
          })}
        </div>

        {/* Quick filters */}
        <div className={styles.bar}>
          <input
            className={styles.search}
            type="search"
            placeholder="Search role, skill or city…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search the directory"
          />
          <div className={styles.seg} role="group" aria-label="Sector">
            {(["all", "games", "apps"] as const).map((s) => (
              <button key={s} type="button" className={sector === s ? styles.segOn : ""} onClick={() => setSector(s)}>
                {s === "all" ? "Games & apps" : s === "games" ? "Games" : "Apps"}
              </button>
            ))}
          </div>
          <div className={styles.seg} role="group" aria-label="Engagement">
            {(["any", "contract", "permanent"] as const).map((t) => (
              <button key={t} type="button" className={type === t ? styles.segOn : ""} onClick={() => setType(t)}>
                {t === "any" ? "Any" : t === "contract" ? "Contract" : "Permanent"}
              </button>
            ))}
          </div>
          <label className={styles.toggle}>
            <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} />
            Available now
          </label>
        </div>

        <div className={styles.meta}>
          <span>
            Showing <strong>{results.length}</strong> of {ROSTER.length}
          </span>
          {anyFilter ? (
            <button type="button" className={styles.clear} onClick={reset}>
              Clear filters
            </button>
          ) : null}
        </div>

        {/* Job-board-style rows */}
        <ul className={styles.list}>
          {results.map((p) => {
            const d = DISCIPLINES[p.discipline as Disc] || { label: p.discipline, tone: "ink" };
            return (
              <li key={p.id}>
                <Link href={`/line-up/${p.id}/spec`} className={`card-shadow ${styles.row}`}>
                  <span className={`${styles.avatar} ${styles[`tone_${d.tone}`]}`} aria-hidden="true">
                    {initials(p)}
                  </span>
                  <span className={styles.main}>
                    <span className={styles.role}>{p.role}</span>
                    <span className={styles.sub}>
                      <span>{p.location.label}</span>
                      <span className={styles.dot}>·</span>
                      <span>{p.industries.map((i) => (i === "games" ? "Games" : "Apps")).join(" & ")}</span>
                      <span className={styles.tag}>{d.label}</span>
                    </span>
                  </span>
                  <span className={styles.right}>
                    {p.dayRateLabel ? <span className={styles.rate}>{p.dayRateLabel}</span> : null}
                    <span className={p.available ? styles.avail : styles.unavail}>
                      {p.available ? "Available" : "Not available"}
                    </span>
                    <span className={styles.view}>
                      View <span aria-hidden="true">→</span>
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {results.length === 0 ? (
          <div className={styles.empty}>
            <p>
              No public profile matches yet, but that&apos;s only the people
              who&apos;ve opted in. We&apos;ll search all {INTERVIEWED} for you.
            </p>
            <Link href="/#brief" className={styles.emptyCta}>
              Brief us a role <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
