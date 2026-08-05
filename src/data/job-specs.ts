/**
 * Job specs for the internal team handbook (/handbook/job-specs).
 *
 * Structure: Job Specs → a folder per client → the specs inside.
 * Password-gated with the rest of the handbook (see src/proxy.ts).
 *
 * TO ADD A SPEC: find the client in SPEC_CLIENTS and push a JobSpec into its
 * `specs` array. Give it a unique `slug` (kebab-case), fill the header fields,
 * and write the brief as ordered `sections`. Everything else renders itself —
 * the folder card count, the spec list row, and the spec document page.
 */

export type SpecSection = {
  heading: string;
  body?: string[]; // paragraphs
  bullets?: string[]; // bullet list
};

export type SpecStatus = "open" | "filled" | "on-hold";

export type JobSpec = {
  slug: string;
  title: string;
  status?: SpecStatus;
  discipline?: string;
  location?: string;
  engagement?: string; // "Permanent" | "Contract" | ...
  salary?: string; // candidate comp, e.g. "€48k jr / €55k intermediate"
  fee?: string; // optional internal note, e.g. "£12,500 flat"
  summary?: string; // one-line what-this-is
  updated?: string; // human date, e.g. "5 Aug 2026"
  sections?: SpecSection[];
  pitch?: string; // verbatim outreach message, rendered as a copy-ready block
};

export type SpecClient = {
  slug: string;
  name: string;
  blurb?: string;
  specs: JobSpec[];
};

export const SPEC_CLIENTS: SpecClient[] = [
  {
    slug: "lessmore",
    name: "Lessmore",
    blurb: "Live and upcoming role briefs for Lessmore.",
    specs: [
      {
        slug: "jr-intermediate-game-designer",
        title: "Jr–Intermediate Game Designer",
        status: "open",
        discipline: "Game Design (UI/UX)",
        engagement: "Permanent",
        salary: "€48k junior / €55k intermediate DOE",
        location: "Fully remote (within ±1hr of CET)",
        summary:
          "Generalist mobile game designer for a live-games studio. Visually very strong and meticulous. €48k junior to €55k intermediate DOE, plus a one-month annual bonus. Fully remote within ±1hr of CET.",
        updated: "5 Aug 2026",
        sections: [
          {
            heading: "Compensation",
            bullets: [
              "Junior level: €48k.",
              "Intermediate level: €55k.",
              "Annual bonus equal to one month's salary, paid once per year.",
              "Fully remote, for anyone within ±1 hour of CET.",
            ],
          },
          {
            heading: "Requirements",
            bullets: [
              "Graduate to intermediate (≈3 years) game designer.",
              "Mobile game designer. Main experience in live games, if any.",
              "Generalist game designer, good in all areas.",
              "Excels at UI/UX, and creating visual mock ups of design flows.",
              "Can create a simple but solid balancing specification.",
              "Basic understanding of Unity.",
            ],
          },
          {
            heading: "Responsibilities",
            bullets: [
              "Create fully implementable designs from high level ideas.",
              "Responsible for executing the low level design:",
              "Excellent visual mock ups of the design flows. Clear and quick to understand. Looks as if it were already part of the game.",
              "Very thought through and concrete designs. Decisions on all details have been made before development starts. Clear how the design interacts and impacts the rest of the game.",
              "Create balancing specifications.",
              "Ideate and find references from other games, to design: features, events and content.",
              "Work with the team to make sure development stays on track. Find and resolve problems quickly.",
            ],
          },
          {
            heading: "Notes",
            bullets: [
              "Want someone that's visually very strong.",
              "Someone that's meticulous, has thought about all the different problems and how something impacts the whole game. Made a decision on all of the details, no open questions.",
            ],
          },
        ],
        pitch: `Jr-Intermediate UI/UX Game Designer - Fully Remote (±1hr CET) - €48-55k DOE + Bonus

"Hey X,

Getting in touch about a role I think might be of interest.

The company are a 30(ish) person Mobile Gaming Powerhouse whose hit games have risen them from a young, scrappy under 10 person team into to an acquired well known team of specialists in their field in just a short few years.

They have four live games currently where the Game Design team works to build out a bank of features and events for those titles for effective LiveOps planning.

Responsibilities

Create fully implementable designs from high level ideas.
Responsible for executing the low level design:
Excellent visual mock ups of the design flows. Clear and quick to understand. Looks as if it were already part of the game.
Very thought through and concrete designs. Clear how the design interacts and impacts the reset of the game. Decisions on all details have been made before development starts.
Simple balancing specification
Ideate and find references from other games to design: features, events and content.
Work with the team to make sure development stays on track; problems are found and resolved quickly.

Requirements

Up to 3 (ish) years of experience.
Mobile Games experience with exposure to working on live games.
Excels at creating visual mock ups of design flows.
Generalist as opposed to specialist
Can create a basic balancing specification.
Basic understanding of unity

The interview process is 3 stages, and can all be done within 3 weeks.

On the package: salary is €48k at junior level and €55k at intermediate depending on experience, plus a yearly bonus equal to one month's salary.

As a lovely extra, the company meets 3 times per year in a different city around Europe for some facetime and team collaboration.

The role is fully remote for anyone within roughly an hour of CET, and you'll need the right to live and work in Europe or the UK.

If this sounds interesting, let's jump on a call and go in to detail.

When works for you?

Best,"`,
      },
    ],
  },
  {
    slug: "appbroda",
    name: "AppBroda",
    blurb: "Live and upcoming role briefs for AppBroda.",
    specs: [],
  },
];

export function getSpecClient(slug: string): SpecClient | undefined {
  return SPEC_CLIENTS.find((c) => c.slug === slug);
}

export function getSpec(
  clientSlug: string,
  specSlug: string
): { client: SpecClient; spec: JobSpec } | undefined {
  const client = getSpecClient(clientSlug);
  const spec = client?.specs.find((s) => s.slug === specSlug);
  if (!client || !spec) return undefined;
  return { client, spec };
}
