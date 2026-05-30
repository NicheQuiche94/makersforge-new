import type { ReactNode } from "react";
import { Button } from "@/components/atoms/Button";
import { Logo } from "@/components/atoms/Logo";
import styles from "./CTABand.module.css";

type CTA = { label: string; href: string };

type CTABandProps = {
  headline?: ReactNode;
  body?: ReactNode;
  cta?: CTA;
  /** Compact container — used on pricing page where the band would
      otherwise dwarf the now-smaller pricing cards above. */
  compact?: boolean;
};

export function CTABand({
  headline,
  body,
  cta = { label: "book a 20-min call", href: "/enquire" },
  compact = false,
}: CTABandProps) {
  return (
    <section className={styles.section}>
      <div className="container">
        <div
          className={`heat-glow ${styles.inner} ${
            compact ? styles.innerCompact : ""
          }`}
        >
          {/* Ghosted MakersForge mark sits in the bottom-right of the
              gradient panel as a subtle brand signature. Hex outline
              at low white opacity reads as visual texture, not a
              foreground logo. */}
          <Logo
            variant="mark"
            size={360}
            monochrome="rgba(255,255,255,0.09)"
            className={styles.bgEmblem}
            title=""
          />
          <div className={styles.content}>
            <h2 className={styles.headline}>
              {headline ?? (
                <>
                  the next hire is{" "}
                  <span className={styles.ghost}>the easy bit.</span>
                </>
              )}
            </h2>
            <p className={styles.body}>
              {body ??
                "Twenty minutes on a call. Tell us the role, the bar, the timeline. We'll have names for you the same week."}
            </p>
            <Button href={cta.href} variant="light" arrow>
              {cta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
