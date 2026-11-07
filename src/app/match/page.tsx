import type { Metadata } from "next";
import { ROSTER, availabilityLabel } from "@/data/roster";
import { MatchMock } from "./MatchMock";

export const metadata: Metadata = {
  title: "Who we'd send you · MakersForge",
  robots: { index: false, follow: false },
};

/* MOCKUP 2026-11-07 (Andre): "paste your job, see who we would send you" lead
   magnet, on a branch for Andre to click through before deciding. Copy and
   numbers are drafts. */
export default function MatchPage() {
  const people = ROSTER.map((p) => ({
    id: p.id,
    codename: p.codename,
    discipline: p.discipline,
    role: p.role,
    background: p.background,
    industries: p.industries,
    available: p.available,
    availability: availabilityLabel(p, true),
    location: p.location.label,
  }));
  return <MatchMock people={people} />;
}
