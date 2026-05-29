import type { ReactNode } from "react";
import { Button } from "@/components/atoms/Button";
import styles from "./GradientBand.module.css";

type CTA = { label: string; href: string };

type GradientBandProps = {
  headline?: ReactNode;
  body?: ReactNode;
  cta?: CTA;
};

export function GradientBand({
  headline,
  body,
  cta = { label: "book a 20-min call", href: "#" },
}: GradientBandProps) {
  return (
    <section className={styles.band}>
      <div className={`container ${styles.wrap}`}>
        <div className={`scroll-reveal ${styles.inner}`}>
          <h2 className={`display-section ${styles.headline}`}>
            {headline ?? (
              <>
                the next hire is{" "}
                <span className={styles.soft}>the easy bit.</span>
              </>
            )}
          </h2>
          <p className={styles.body}>
            {body ??
              "Twenty minutes on a call. Tell us the role, the bar, the timeline. We'll have names for you the same week."}
          </p>
          <Button href={cta.href} variant="band" arrow>
            {cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
