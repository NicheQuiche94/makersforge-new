import type { ReactNode } from "react";
import { Button } from "@/components/atoms/Button";
import styles from "./CTABand.module.css";

type CTA = { label: string; href: string };

type CTABandProps = {
  headline?: ReactNode;
  body?: ReactNode;
  cta?: CTA;
};

export function CTABand({
  headline,
  body,
  cta = { label: "book a 20-min call", href: "#" },
}: CTABandProps) {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={`heat-bright-glow ${styles.inner}`}>
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
    </section>
  );
}
