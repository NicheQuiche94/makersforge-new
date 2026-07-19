import type { JobCategory } from "./jobs";

/**
 * Static intro copy for the category landing pages (/jobs/categories/[cat]).
 * These give the filtered views real indexable content so they can rank for
 * the head terms (brief §5), "user acquisition jobs games", "marketing
 * artist jobs", "mobile growth jobs", etc.
 */
export const CATEGORY_COPY: Record<
  JobCategory,
  { h1: string; intro: string; metaTitle: string; metaDescription: string }
> = {
  ua: {
    h1: "User acquisition jobs in games & apps",
    intro:
      "Live user acquisition roles at mobile games studios and consumer apps, from hands-on UA managers to performance-marketing leads. Every listing is hand-checked for remit: paid growth on mobile, nothing off-topic. New roles are sourced weekly.",
    metaTitle:
      "User Acquisition Jobs in Games & Apps, UA Manager Roles | MakersForge",
    metaDescription:
      "Curated user acquisition and performance-marketing jobs in mobile games and consumer apps. UA manager, performance marketing manager and growth roles, updated weekly.",
  },
  growth: {
    h1: "Growth jobs in games & apps",
    intro:
      "Growth roles across mobile games and subscription apps, growth managers, growth leads and heads of growth who own the full funnel from acquisition through retention. Only in-remit consumer growth roles make the board.",
    metaTitle: "Mobile Growth Jobs in Games & Apps, Growth Manager | MakersForge",
    metaDescription:
      "Curated growth jobs in mobile games and consumer apps: growth manager, growth lead and head of growth roles owning acquisition, activation and retention.",
  },
  "marketing-art": {
    h1: "Marketing artist jobs in games & apps",
    intro:
      "Performance-creative roles for games and apps, marketing artists, motion designers and video artists who make ad creative that moves ROAS. If you brief, cut and read UA creative for a living, this is your slice of the board.",
    metaTitle:
      "Marketing Artist Jobs in Games & Apps, UA Creative & Motion | MakersForge",
    metaDescription:
      "Curated marketing artist and UA creative jobs in mobile games and apps: motion designers, video artists and performance-creative roles, updated weekly.",
  },
  "creative-strategy": {
    h1: "Creative strategist jobs in games & apps",
    intro:
      "Creative strategy roles at games studios and consumer apps, the people turning performance data into the next round of winning ad concepts. Briefs, hooks, angles and the testing framework behind them.",
    metaTitle:
      "Creative Strategist Jobs in Games & Apps, Performance Creative | MakersForge",
    metaDescription:
      "Curated creative strategist jobs in mobile games and consumer apps. Performance-creative strategy roles owning briefs, angles and ad testing frameworks.",
  },
  aso: {
    h1: "ASO jobs in games & apps",
    intro:
      "App store optimisation roles across mobile games and consumer apps, ASO managers and specialists owning keywords, store listings and conversion experiments on the App Store and Google Play.",
    metaTitle: "ASO Jobs in Games & Apps, App Store Optimisation | MakersForge",
    metaDescription:
      "Curated ASO jobs in mobile games and consumer apps: app store optimisation managers and specialists owning keywords, metadata and store conversion.",
  },
};
