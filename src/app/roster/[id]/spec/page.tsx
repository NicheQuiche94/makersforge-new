"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Logo } from "@/components/atoms/Logo";
import { ROSTER, BUDGET_LABELS } from "@/data/roster";
import {
  type Currency,
  formatRate,
  readStoredCurrency,
} from "@/lib/currency";
import styles from "./spec.module.css";

/**
 * /roster/[id]/spec
 *
 * Printable single-page candidate spec. Linked from the "Download spec"
 * button on the lineup modal. Layout is intentionally calm and content-
 * dense so the user can either read it on screen or save it as PDF via
 * the browser print dialog (the toolbar's "Save as PDF" button just
 * calls window.print(); print CSS hides the toolbar, forces colours,
 * and constrains to A4).
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
    setCurrency(readStoredCurrency());
  }, []);

  if (!profile) {
    return (
      <div className={styles.page}>
        <p className={styles.notFound}>
          Profile not found.{" "}
          <Link href="/roster">Back to the lineup →</Link>
        </p>
      </div>
    );
  }

  const cats = [...(profile.gamesCat ?? []), ...(profile.appsCat ?? [])];
  const disciplineLabel =
    profile.discipline === "creative"
      ? "Creative production"
      : profile.discipline.toUpperCase();
  const openToCopy = profile.availableFor
    .map((k) => k[0].toUpperCase() + k.slice(1))
    .join(" · ");

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <Link href="/roster" className={styles.backLink}>
          ← Back to lineup
        </Link>
        <button
          type="button"
          className={styles.printBtn}
          onClick={() => window.print()}
        >
          Save as PDF
        </button>
      </div>

      <article className={styles.spec}>
        <header className={`heat-glow ${styles.head}`}>
          <div className={styles.headInner}>
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

        <div className={styles.body}>
          {profile.summary && (
            <Section h="Summary">
              <p className={styles.lead}>{profile.summary}</p>
            </Section>
          )}

          <Section h="Commercials">
            <dl className={styles.rates}>
              <RateRow
                k="Day rate (contract)"
                v={formatRate(profile.rateMin, currency, "day")}
              />
              {profile.salaryAnnual !== undefined && (
                <RateRow
                  k="Annual salary (permanent)"
                  v={formatRate(profile.salaryAnnual, currency, "year")}
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
              <FilterRow k="Industry" v={profile.industries.join(" · ")} />
              {cats.length > 0 && (
                <FilterRow k="Categories" v={cats.join(" · ")} />
              )}
              {profile.genre.length > 0 && (
                <FilterRow k="Genres" v={profile.genre.join(" · ")} />
              )}
              {profile.discipline === "ua" &&
                profile.channels &&
                profile.channels.length > 0 && (
                  <FilterRow k="Channels" v={profile.channels.join(" · ")} />
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
                    v={profile.formats.join(" · ")}
                  />
                )}
              <FilterRow k="Expertise" v={profile.expertise.join(" · ")} />
              <FilterRow k="Location" v={profile.location.label} />
            </dl>
          </Section>
        </div>

        <footer className={styles.foot}>
          <span>MakersForge</span>
          <span>makersforge.gg</span>
        </footer>
      </article>
    </div>
  );
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
