/**
 * Resources (Andre 2026-11-08): one home in the nav for the free tools and
 * the hiring guides, so new pieces slot in without crowding the menu. Each
 * guide can carry its own takeaway (lib/guides `magnet`), which also lives
 * here. Add a tool to TOOLS and it shows in the menu and on /resources.
 */
import { liveGuides } from "@/lib/guides";

export type Resource = { href: string; title: string; blurb: string; tag: string };

export const TOOLS: Resource[] = [
  { href: "/job-ad-grading-tool", title: "Job ad grading tool", blurb: "Score your job ad out of 100, with the fixes that will make the biggest difference.", tag: "Free tool" },
  { href: "/compare", title: "Design your hiring route", blurb: "A dated plan for your role: which route to take, in what order, and when the hire lands.", tag: "Free tool" },
];

/** Downloadable guides and reports (Andre 2026-11-24). They sit behind the
    one-email unlock on /resources. Add a file to public/resources/ and a row here. */
export type Download = { file: string; cover: string; title: string; blurb: string; inside: string[]; tag: string; meta: string };
export const DOWNLOADS: Download[] = [
  {
    file: "/resources/makersforge-the-4-ways-to-find-talent.pdf",
    cover: "/resources/covers/four-ways.png",
    title: "The 4 ways to find talent",
    blurb: "What each method costs, what it risks, and which roles suit it.",
    inside: ["Referrals, job ads, D2C and talent communities, side by side", "Risk, cost and effort scored for every method", "How to set each one up, with tools and prices"],
    tag: "Guide",
    meta: "PDF · 31 pages",
  },
];

/** Guides only appear once at least one is published. */
export const GUIDES_LINK: Resource = { href: "/guides", title: "The Hiring Playbook", blurb: "Practical answers to the questions studios ask about hiring, written by Andre.", tag: "Playbook" };

export const menuResources = () => [...TOOLS, ...(liveGuides().length ? [GUIDES_LINK] : [])];
