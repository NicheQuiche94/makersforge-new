import jobsData from "@/data/jobs.json";
import { grade } from "@/lib/adGrader";

/* The job board as a benchmark for the grading tool: every full ad on it,
   scored the same way (stubs that only link out are left out). */
type Job = { slug: string; title: string; company: { name?: string } | string; location?: string; remote?: string; salary?: string | null; employment_type?: string; description_md: string };

export const boardAdText = (x: Job) =>
  [x.title, [x.location, x.remote].filter(Boolean).join(" · "), x.salary ? `Salary: ${x.salary}` : "", (x.employment_type || "").replace("_", " ").toLowerCase(), "", x.description_md]
    .filter((l, i) => l || i === 4)
    .join("\n");

export function boardScores() {
  const all = ((Array.isArray(jobsData) ? jobsData : (jobsData as { jobs: Job[] }).jobs) as Job[]).filter((x) => x.description_md.split(/\s+/).length >= 150);
  const scored = all.map((x) => ({ x, s: grade(boardAdText(x), x.title).score })).sort((a, b) => b.s - a.s);
  const avg = Math.round(scored.reduce((a, z) => a + z.s, 0) / Math.max(1, scored.length));
  const withPay = Math.round((scored.filter((z) => /[£$€]\s?\d/.test(boardAdText(z.x))).length / Math.max(1, scored.length)) * 100);
  return { scored, bench: { avg, n: scored.length, withPay } };
}
