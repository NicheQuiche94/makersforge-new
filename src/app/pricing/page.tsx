import type { Metadata } from "next";
import { PricingHero } from "@/components/sections/PricingHero";
import { PricingGrid } from "@/components/sections/PricingGrid";
import { ComparisonStrip } from "@/components/sections/ComparisonStrip";
import { CTABand } from "@/components/sections/CTABand";

export const metadata: Metadata = {
  title: "Pricing · MakersForge",
  description:
    "Flat monthly fee per specialist engaged. Flat £10,000 for permanent placement. No markup on day rate.",
};

/* FAQ section dropped per Andre 2026-05-30 v3 — no content to put in
   it yet and the page reads better without an empty section. CTA band
   is rendered with the `compact` prop so its container doesn't tower
   over the now-smaller pricing cards above. */
export default function PricingPage() {
  return (
    <>
      <PricingHero />
      <PricingGrid />
      <ComparisonStrip />
      <CTABand
        compact
        headline={
          <>
            Still working out{" "}
            <em style={{ fontStyle: "italic", color: "#fff" }}>
              the shape of the hire?
            </em>
          </>
        }
        body="Tell us about you, your company, your culture, your product and a few other details so we can personalise your talent pipeline."
        cta={{ label: "Book a briefing", href: "/enquire" }}
      />
    </>
  );
}
