import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { availability } from "@/lib/onboarding/db";
import { WEEKS } from "@/lib/plans";
import { tierFor } from "@/lib/tier";
import type { Method } from "@/lib/hireTimeline";
import { TimelineResult } from "../TimelineResult";

export const metadata: Metadata = { title: "Timeline preview · MakersForge", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/* Local-only preview of a timeline without saving a lead:
   /hire-timeline/preview?t=Senior%20Game%20Designer&c=FR&m=jobad&by=2026-11-30
   Off on the live site (404), so it can't be used to skip the email. */
export default async function TimelinePreview({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  if (process.env.VERCEL_ENV === "production") notFound();
  const q = await searchParams;
  const title = (q.t || "Senior Game Designer").slice(0, 120);
  const method: Method = q.m === "recruiter" ? "recruiter" : "jobad";
  const weeks = await availability().catch(() => WEEKS);
  const next = weeks.find((w) => w.open > 0);
  const month = next?.start.slice(0, 7);
  const left = weeks.filter((w) => w.start.slice(0, 7) === month).reduce((n, w) => n + w.open, 0);
  return (
    <TimelineResult
      input={{ title, tier: tierFor(title).tier, country: q.c || "GB", method, needBy: q.by, nextWeek: next?.start, today: new Date().toISOString() }}
      slots={{ left, month: next ? new Date(next.start + "T00:00:00").toLocaleDateString("en-GB", { month: "long" }) : "" }}
    />
  );
}
