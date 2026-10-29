"use client";

import { InterviewRequest } from "@/components/sections/InterviewRequest";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Logo } from "@/components/atoms/Logo";
import { ROSTER, BUDGET_LABELS } from "@/data/roster";
import {
  CURRENCIES,
  CURRENCY_SYMBOLS,
  type Currency,
  formatRate,
  isCurrency,
  readStoredCurrency,
  writeStoredCurrency,
} from "@/lib/currency";
import styles from "./spec.module.css";

/**
 * /line-up/[id]/spec
 *
 * Printable single-page candidate spec. Linked from the "Download spec"
 * button on the lineup modal. Layout is intentionally calm and content-
 * dense so the user can either read it on screen or download it as a
 * PDF. "Download PDF" fetches ./pdf, which renders this page in headless
 * Chrome with the print CSS (hides the toolbar, forces colours, A4) and
 * returns a real file; if that fails it falls back to window.print().
 * The PDF route passes ?currency= so the file matches what was on screen.
 *
 * Studios often use the spec to circulate to teammates who don't have
 * the site URL handy, so it has to stand alone as a document.
 */
export default function SpecPage() {
  const params = useParams<{ id: string }>();
  const profile = ROSTER.find((p) => p.id === params.id);

  /* Pick up the currency the user selected on the lineup toolbar so
     the spec and any subsequent PDF export carry the same rates the
     user was looking at when they clicked Download. Defaults to GBP
     on SSR; reads localStorage after mount. */
  const [currency, setCurrency] = useState<Currency>("GBP");
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("currency");
    setCurrency(isCurrency(fromUrl) ? fromUrl : readStoredCurrency());
  }, []);

  const [downloading, setDownloading] = useState(false);
  async function downloadPdf() {
    if (!profile) return;
    setDownloading(true);
    try {
      const res = await fetch(`/line-up/${profile.id}/spec/pdf?currency=${currency}`);
      if (!res.ok) throw new Error(String(res.status));
      const href = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = href;
      a.download = `MakersForge-${profile.codename.replace("·", "-")}.pdf`;
      a.click();
      URL.revokeObjectURL(href);
    } catch {
      window.print();
    } finally {
      setDownloading(false);
    }
  }

  if (!profile) {
    return (
      <div className={styles.page}>
        <p className={styles.notFound}>
          Profile not found.{" "}
          <Link href="/line-up">Back to the lineup →</Link>
        </p>
      </div>
    );
  }

  const cats = [...(profile.gamesCat ?? []), ...(profile.appsCat ?? [])];
  const disciplineLabel =
    profile.discipline === "creative"
      ? "Creative production"
      : profile.discipline === "product"
        ? "Product / Monetisation"
        : profile.discipline === "design"
          ? "Game design"
          : profile.discipline.toUpperCase();
  const list = (keys: string[]) => keys.map(label).join(" · ");
  const openToCopy = profile.availableFor
    .map((k) => k[0].toUpperCase() + k.slice(1))
    .join(" · ");

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <Link href="/line-up" className={styles.backLink}>
          ← Back to lineup
        </Link>
      </div>

      <article className={styles.spec}>
        <header className={`heat-glow ${styles.head}`}>
          <div className={styles.headInner}>
            <div className={styles.headTop}>
              <div className={styles.brand}>
                <Logo
                  size={28}
                  variant="mark"
                  monochrome="#ffffff"
                  title=""
                />
                <span className={styles.brandText}>
                  MakersForge · Talent spec
                </span>
              </div>
              <button
                type="button"
                className={styles.printBtn}
                onClick={downloadPdf}
                disabled={downloading}
              >
                {downloading ? "Preparing PDF…" : "Download PDF"}
              </button>
            </div>
            <div className={styles.codeRow}>
              <span className={styles.codename}>{profile.codename}</span>
              <span className={styles.status}>
                <span className={styles.statusDot} />
                {profile.available ? "Available now" : "In contract"}
              </span>
            </div>
            <h1 className={styles.role}>{profile.role}</h1>
            <p className={styles.bgLine}>
              {profile.background} · {profile.location.label}
            </p>
            <div className={styles.openTo}>
              <span className={styles.openToLabel}>Open to</span>
              {profile.availableFor.map((kind) => (
                <span key={kind} className={styles.openToPill}>
                  {kind}
                </span>
              ))}
            </div>
          </div>
        </header>

        {profile.favourites && (
          <dl className={styles.favs}>
            {profile.favourites.song && (
              <div className={styles.fav}>
                <dt>Favourite song</dt>
                <dd>{profile.favourites.song}</dd>
              </div>
            )}
            {profile.favourites.colour && (
              <div className={styles.fav}>
                <dt>Favourite colour</dt>
                <dd>
                  {profile.favourites.colourHex && (
                    <span
                      className={styles.swatch}
                      style={{ background: profile.favourites.colourHex }}
                    />
                  )}
                  {profile.favourites.colour}
                </dd>
              </div>
            )}
            {profile.favourites.game && (
              <div className={styles.fav}>
                <dt>Favourite game</dt>
                <dd>{profile.favourites.game}</dd>
              </div>
            )}
          </dl>
        )}

        <div className={styles.body}>
          {profile.summary && (
            <Section h="Summary">
              <p className={styles.lead}>{profile.summary}</p>
            </Section>
          )}

          <Section h="Commercials">
            <div className={styles.currencySeg} role="group" aria-label="Currency">
              {CURRENCIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={currency === c ? styles.currencyOn : ""}
                  onClick={() => {
                    setCurrency(c);
                    writeStoredCurrency(c);
                  }}
                  aria-pressed={currency === c}
                  aria-label={`Show rates in ${c}`}
                >
                  {CURRENCY_SYMBOLS[c]}
                </button>
              ))}
            </div>
            <dl className={styles.rates}>
              {/* Permanent-only profiles have no day rate to show. */}
              {profile.availableFor.includes("contract") && (
                <RateRow
                  k="Day rate (contract)"
                  v={formatRate(profile.rateMin, currency, "day", profile.rateMax)}
                />
              )}
              {profile.salaryAnnual !== undefined && (
                <RateRow
                  k="Annual salary (permanent)"
                  v={formatRate(
                    profile.salaryAnnual,
                    currency,
                    "year",
                    profile.salaryAnnualMax,
                  )}
                />
              )}
              <RateRow k="Open to" v={openToCopy} />
              <RateRow
                k="Availability"
                v={profile.available ? "Available now" : "Currently in contract"}
              />
              {profile.discipline === "ua" && profile.budget !== undefined && (
                <RateRow
                  k="Budget managed"
                  v={BUDGET_LABELS[profile.budget]}
                />
              )}
            </dl>
          </Section>

          {profile.skills && profile.skills.length > 0 && (
            <Section h="Skills">
              <ul className={styles.chipList}>
                {profile.skills.map((s, i) => (
                  <li key={i} className={styles.chip}>
                    {s}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {profile.experience && profile.experience.length > 0 && (
            <Section h="Experience">
              <ul className={styles.bulletList}>
                {profile.experience.map((para, i) => (
                  <li key={i}>{para}</li>
                ))}
              </ul>
            </Section>
          )}

          {profile.motivations && (
            <Section h="Motivations">
              <p className={styles.para}>{profile.motivations}</p>
            </Section>
          )}

          {profile.recruiterNotes && profile.recruiterNotes.length > 0 && (
            <Section h="Recruiter notes">
              {profile.recruiterNotes.map((para, i) => (
                <p key={i} className={styles.para}>
                  {para}
                </p>
              ))}
            </Section>
          )}

          <Section h="Profile filters">
            <dl className={styles.filterGrid}>
              <FilterRow k="Discipline" v={disciplineLabel} />
              <FilterRow k="Industry" v={list(profile.industries)} />
              {cats.length > 0 && (
                <FilterRow k="Categories" v={list(cats)} />
              )}
              {profile.genre.length > 0 && (
                <FilterRow k="Genres" v={list(profile.genre)} />
              )}
              {profile.discipline === "ua" &&
                profile.channels &&
                profile.channels.length > 0 && (
                  <FilterRow k="Channels" v={list(profile.channels)} />
                )}
              {profile.discipline === "ua" &&
                profile.monetisation &&
                profile.monetisation.length > 0 && (
                  <FilterRow
                    k="Monetisation"
                    v={profile.monetisation.join(" · ").toUpperCase()}
                  />
                )}
              {profile.discipline !== "ua" &&
                profile.formats &&
                profile.formats.length > 0 && (
                  <FilterRow
                    k="Creative formats"
                    v={list(profile.formats)}
                  />
                )}
              <FilterRow k="Expertise" v={list(profile.expertise)} />
              <FilterRow k="Location" v={profile.location.label} />
            </dl>
          </Section>

          {/* Two routes to the interview: in writing, or a call with us
              (never mistaken for a call with the candidate). 2026-10-27. */}
          <InterviewRequest codename={profile.codename} />
        </div>

        <footer className={styles.foot}>
          <span>MakersForge</span>
          <span>makersforge.gg</span>
        </footer>
      </article>
    </div>
  );
}

/* Display names for filter keys; matches the chip labels on the lineup.
   Anything not listed just gets a capital first letter. */
const LABELS: Record<string, string> = {
  hypercasual: "Hypercasual",
  hybridcasual: "Hybrid-casual",
  midcore: "Midcore",
  rpg: "RPG",
  sports: "Sports/racing",
  cards: "Tabletop/cards",
  health: "Health & fitness",
  photo: "Photo & video",
  meta: "Meta",
  asa: "Apple Search Ads",
  tiktok: "TikTok",
  ugc: "UGC",
  skan: "SKAN / measurement",
  scaling: "Creative scaling",
  liveops: "LiveOps",
  economy: "Economy & balancing",
  audience: "Audience strategy",
};

function label(key: string) {
  return LABELS[key] ?? key[0].toUpperCase() + key.slice(1);
}

function Section({
  h,
  children,
}: {
  h: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.h2}>{h}</h2>
      {children}
    </section>
  );
}

function RateRow({ k, v }: { k: string; v: string }) {
  return (
    <div className={styles.rateRow}>
      <dt>{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}

function FilterRow({ k, v }: { k: string; v: string }) {
  return (
    <div className={styles.filterRow}>
      <dt>{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}
