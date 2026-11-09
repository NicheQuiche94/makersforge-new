import type { Metadata } from "next";
import { availability } from "@/lib/onboarding/db";
import { WEEKS } from "@/lib/plans";
import { tierFor } from "@/lib/tier";
import type { Method } from "@/lib/hireTimeline";
import { TimelineResult } from "../TimelineResult";

export const metadata: Metadata = { title: "Your hire timeline · MakersForge", robots: { index: false } };
export const dynamic = "force-dynamic";

/* The timeline the email links to (MOCKUP: reads the answers from the link). */
export default async function TimelineResultPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const title = (q.t || "").slice(0, 120) || "your role";
  const method: Method = q.m === "recruiter" ? "recruiter" : "jobad";
  // Live search-week calendar; the mock calendar if the database can't be reached.
  const weeks = await availability().catch(() => WEEKS);
  const next = weeks.find((w) => w.open > 0);
  const month = next?.start.slice(0, 7);
  const left = weeks.filter((w) => w.start.slice(0, 7) === month).reduce((n, w) => n + w.open, 0);
  return (
    <TimelineResult
      input={{ title, tier: tierFor(title).tier, country: q.c || "GB", method, needBy: q.by, nextWeek: next?.start }}
      slots={{ left, month: next ? new Date(next.start + "T00:00:00").toLocaleDateString("en-GB", { month: "long" }) : "" }}
      mock={q.mock === "1"}
    />
  );
}
