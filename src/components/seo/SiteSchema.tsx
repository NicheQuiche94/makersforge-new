import { SITE_URL } from "@/lib/site";

/**
 * Site-wide Organization + WebSite JSON-LD (2026-07-19). Gives search and
 * AI answer engines a single, clean definition of the MakersForge entity:
 * what it is, what it knows about, and where else it lives (sameAs). This
 * is the anchor LLMs use to understand and cite the brand. Rendered once,
 * in the root layout, so it's on every page.
 */
const DESCRIPTION =
  "Direct-to-candidate recruitment for mobile game studios and app companies. We target and engage the right people directly.";

export function SiteSchema() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "MakersForge",
        url: SITE_URL,
        description: DESCRIPTION,
        email: "andre@makersforge.gg",
        sameAs: ["https://www.linkedin.com/company/makers-forge"],
        knowsAbout: [
          "User acquisition",
          "Mobile game growth",
          "App store optimization",
          "Marketing art",
          "Performance marketing",
          "Creative strategy",
        ],
        areaServed: "Europe, the Middle East and Africa",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "MakersForge",
        url: SITE_URL,
        description: DESCRIPTION,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
