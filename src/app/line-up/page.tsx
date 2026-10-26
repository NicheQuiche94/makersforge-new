import type { Metadata } from "next";
import { RosterHero } from "@/components/sections/RosterHero";
import { TalentDirectoryApp } from "@/components/sections/TalentDirectoryApp";
import { CTABand } from "@/components/sections/CTABand";

export const metadata: Metadata = {
  title: "Talent Directory · MakersForge",
  description:
    "Mobile games and app specialists we've personally interviewed: growth and UA, art, product and more. Profiles anonymised; we make the intro after a brief.",
};

/* 2026-10-27: the lineup became the MakersForge Talent Directory — the bench
   behind the "5 candidates in 5 working days" promise. Job-board-style rows
   with a Spotify-style discipline picker (TalentDirectoryApp) replace the
   old card grid + live strip. The bottom CTA sends anyone who doesn't see a
   fit to the brief: we search all 250, not just the public profiles. */
export default function RosterPage() {
  return (
    <>
      <RosterHero />
      <TalentDirectoryApp />
      <CTABand
        compact
        headline={
          <>
            Don&apos;t see the{" "}
            <em style={{ fontStyle: "italic", color: "#fff" }}>right person?</em>
          </>
        }
        body="These are only the specialists who've opted in to a public profile. Send us the role and we'll send 3 matching profiles from everyone we know, free, so you can judge us before agreeing anything."
        cta={{ label: "Try us free", href: "/#brief" }}
      />
    </>
  );
}
