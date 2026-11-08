import type { Metadata } from "next";
import jobsData from "@/data/jobs.json";
import { grade } from "@/lib/adGrader";
import { GradingTool, type Sample } from "./GradingTool";

export const metadata: Metadata = {
  title: "Job ad grading tool · MakersForge",
  robots: { index: false, follow: false },
};

/* MOCKUP 2026-11-08 (Andre): paste a job ad, get a score out of 100 and the
   fixes that matter most; Andre offers to rewrite it by hand. Step two in a
   chain of free tools (what am I hiring for → the ad → compare routes →
   a search week). Weights and copy are drafts to tune by trying real ads. */

type Job = { slug: string; title: string; company: { name?: string } | string; location?: string; remote?: string; salary?: string | null; employment_type?: string; description_md: string };

const adText = (x: Job) =>
  [x.title, [x.location, x.remote].filter(Boolean).join(" · "), x.salary ? `Salary: ${x.salary}` : "", (x.employment_type || "").replace("_", " ").toLowerCase(), "", x.description_md]
    .filter((l, i) => l || i === 4)
    .join("\n");

export default function GradingToolPage() {
  const all = ((Array.isArray(jobsData) ? jobsData : (jobsData as { jobs: Job[] }).jobs) as Job[]).filter((x) => x.description_md.split(/\s+/).length >= 150);
  const scored = all.map((x) => ({ x, s: grade(adText(x), x.title).score })).sort((a, b) => b.s - a.s);
  const avg = Math.round(scored.reduce((a, z) => a + z.s, 0) / scored.length);
  const withPay = Math.round((scored.filter((z) => /[£$€]\s?\d/.test(adText(z.x))).length / scored.length) * 100);
  // A spread of real ads to try: the best, the middle and the weakest.
  const pick = [...scored.slice(0, 3), ...scored.slice((scored.length >> 1) - 2, (scored.length >> 1) + 1), ...scored.slice(-3)];
  const samples: Sample[] = pick.map(({ x, s }) => ({
    id: x.slug,
    label: `${typeof x.company === "string" ? x.company : x.company?.name ?? ""}: ${x.title} (${s})`,
    title: x.title,
    text: adText(x),
  }));
  return <GradingTool samples={samples} bench={{ avg, n: scored.length, withPay }} />;
}
