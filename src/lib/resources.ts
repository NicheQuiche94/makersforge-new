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
  { href: "/hire-timeline", title: "When will your hire start?", blurb: "Your likely start date, stage by stage, with the notice period in their country, against the date you need them.", tag: "Free tool" },
  { href: "/compare", title: "Compare hiring routes", blurb: "Every way to hire your role side by side: cost, weeks to hire, your team's hours and who you reach.", tag: "Free tool" },
];

/** Guides only appear once at least one is published. */
export const GUIDES_LINK: Resource = { href: "/guides", title: "The Hiring Playbook", blurb: "Practical answers to the questions studios ask about hiring, written by Andre.", tag: "Playbook" };

export const menuResources = () => [...TOOLS, ...(liveGuides().length ? [GUIDES_LINK] : [])];
