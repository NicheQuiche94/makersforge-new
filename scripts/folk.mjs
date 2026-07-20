/**
 * Minimal shared Folk client (2026-07-20). Used by careers-research.mjs to push
 * discovered companies in as leads. Mirrors the API shape in folk-import.mjs.
 */
const API = "https://api.folk.app/v1";
export const G_COMPANIES = "grp_e6afe55b-bffc-4b2e-8ad0-09e8cd7c4dea"; // Companies MF
export const G_CONTACTS = "grp_797b287b-c997-4b6f-8179-bf84960b0c1d"; // Contacts MF

export const normName = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

export async function folk(path, method = "GET", body, key) {
  const res = await fetch(API + path, {
    method,
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const d = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Folk ${res.status} ${JSON.stringify(d).slice(0, 220)}`);
  return d.data ?? d;
}

/** All Folk companies (paginated) — for dedupe by normalised name. */
export async function listCompanies(key) {
  let path = "/companies?limit=100";
  const out = [];
  while (path) {
    const d = await folk(path, "GET", undefined, key);
    out.push(...(d.items || []));
    const next = d.pagination?.nextLink;
    path = next ? next.replace(API, "") : null;
  }
  return out;
}

/** All Folk people (paginated). */
export async function listPeople(key) {
  let path = "/people?limit=100";
  const out = [];
  while (path) {
    const d = await folk(path, "GET", undefined, key);
    out.push(...(d.items || []));
    const next = d.pagination?.nextLink;
    path = next ? next.replace(API, "") : null;
  }
  return out;
}

/** Create a person (decision-maker) as a lead in "Contacts MF", linked to a
 *  company. */
export async function createPerson(key, { fullName, jobTitle, email, linkedin, companyId }) {
  return folk(
    "/people",
    "POST",
    {
      fullName,
      jobTitle: jobTitle || "",
      emails: email ? [email] : [],
      urls: linkedin ? [linkedin] : [],
      companies: companyId ? [{ id: companyId }] : [],
      groups: [{ id: G_CONTACTS }],
      customFieldValues: { [G_CONTACTS]: { Status: "Lead" } },
    },
    key,
  );
}

/** Create a company as a lead in "Companies MF". */
export async function createCompanyLead(key, { name, url, sector, channel, nextSteps }) {
  return folk(
    "/companies",
    "POST",
    {
      name,
      urls: url ? [url] : [],
      industry: sector === "apps" ? "Consumer apps" : "Mobile games",
      groups: [{ id: G_COMPANIES }],
      customFieldValues: {
        [G_COMPANIES]: {
          Status: "Lead",
          Channel: channel || "Play Store signal",
          "Next Steps": nextSteps || "",
        },
      },
    },
    key,
  );
}
