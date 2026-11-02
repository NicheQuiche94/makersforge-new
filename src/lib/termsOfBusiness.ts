/**
 * MakersForge Terms of Business as a template (2026-11-02).
 *
 * Source: Andre's long-standing Terms of Business (the TyrAds copy, already
 * checked by his advisers). His wording is kept verbatim; only variables,
 * the plan-specific fee clauses and the self-serve additions differ. Every
 * clause is tagged so the review page can show what's original, what's a
 * variable and what's new:
 *   kind "original" - Andre's text, unchanged (variables substituted)
 *   kind "fixed"    - Andre's text with an obvious template error fixed
 *   kind "new"      - added for self-serve; needs Andre's OK
 *
 * Variants follow the pricing (2026-11-02): a permanent hire, a contractor,
 * or a batch of 2 to 5 permanent roles (each hire £1,000 less than the last),
 * and permanent / batch can be retained (15% off, a third up front, credited
 * against the first hires). The replacement guarantee (Andre's 3.5–3.7) is
 * kept word for word but OFF: not offered self-serve, only by request on a
 * negotiated deal, at a price.
 */
import { BATCH_STEPS, RETAINED_OFF, SINGLE_FEE, gbp, retainedPrice } from "@/lib/plans";

export type TermsVariant = "permanent" | "contract" | "batch";

export type TermsVars = {
  variant: TermsVariant;
  date: string; // "2 November 2026"
  client: string; // registered company name
  clientNumber: string;
  clientAddress: string;
  roles?: number; // batch size, 2 to 5
  retained?: boolean; // permanent and batch only
  contractFee: string; // "£1,000"
  cancelFee: string; // "£1,500"
  cancelHours: number; // 48
  guarantee?: boolean; // Andre's replacement guarantee, off unless negotiated
};

export type Clause = { n?: string; text: string; kind: "original" | "fixed" | "new"; note?: string; sub?: Clause[] };
export type Section = { title: string; clauses: Clause[] };

const MF = "MakersForge Ltd";
export const MF_NUMBER = "15616483";
export const MF_OFFICE = "Second Floor, 2 The Waterhouse, Waterhouse Street, Hemel Hempstead, Herts HP1 1ES";

export function buildTerms(v: TermsVars): { parties: Clause[]; sections: Section[] } {
  const C = v.client || "[CLIENT]";
  const retained = !!v.retained && v.variant !== "contract";
  const n = v.variant === "batch" ? Math.min(Math.max(v.roles ?? 2, 2), BATCH_STEPS.length) : 1;
  const k = retained ? 1 - RETAINED_OFF : 1;
  const steps = (v.variant === "batch" ? BATCH_STEPS.slice(0, n) : [SINGLE_FEE]).map((x) => x * k);
  const retainer = retainedPrice(steps.reduce((a, b) => a + b, 0) / k).upfront;
  const ORD = ["first", "second", "third", "fourth", "fifth"];

  const parties: Clause[] = [
    { text: `THIS AGREEMENT is made on ${v.date}`, kind: "original" },
    { n: "(1)", text: `${MF} (company number ${MF_NUMBER}) with a registered office "${MF_OFFICE}"`, kind: "new", note: "Your company number added." },
    {
      n: "(2)",
      text: `${C} (company number ${v.clientNumber || "[NUMBER]"}) with a registered office "${v.clientAddress || "[ADDRESS]"}" (the "Client")`,
      kind: "new",
      note: "Company number added so the invoice details live on the terms.",
    },
  ];

  const definitions: Clause[] = [
    { text: `"Candidate" - a person Introduced by ${MF} to ${C} to be considered for an Engagement;`, kind: "original" },
    {
      text: `"Engagement" - the employment, hire or other use (directly or indirectly) and whether under a contract of service, contract for services or otherwise, and/or whether on a permanent, temporary or other basis, of a Candidate by or on behalf of ${C}`,
      kind: "original",
    },
    { text: `"Fees" - the fees payable by ${C} to ${MF} calculated in accordance with this Agreement.`, kind: "original" },
    { text: `"Introduce" - the provision to ${C} of a curriculum vitae or any other details, whether written or oral, that identifies a Candidate.`, kind: "original" },
    { text: `"Recruitment Services" the provision to ${C} of ongoing services related to talent acquisition.`, kind: "original" },
    {
      text: `"Search Week" - the week, Monday to Friday, booked by ${C} during which ${MF} carries out the search for a vacancy.`,
      kind: "new",
      note: "Needed for the cancellation clause.",
    },
    ...(v.variant === "batch"
      ? [
          {
            text: `"Batch" - the ${n} permanent vacancies released by ${C} to ${MF} under this Agreement, each with its own Search Week.`,
            kind: "new" as const,
          },
        ]
      : []),
    ...(retained
      ? [
          {
            text: `"Retainer" - the sum payable by ${C} on signing this Agreement under clause 3, which is credited against the Fees.`,
            kind: "new" as const,
          },
        ]
      : []),
    {
      text: `"Data Protection Laws" the Data Protection Act 1998, together with successor legislation incorporating the General Data Protection Regulation;`,
      kind: "original",
    },
    {
      text: `"Personal Data" personal data and special categories of personal data as defined by the Data Protection Act 1998, together with successor legislation incorporating the General Data Protection Regulation;`,
      kind: "original",
    },
    { text: `"Data Subjects" the subjects of Personal Data.`, kind: "original" },
  ];

  const services: Clause[] = [
    {
      n: "2.1",
      text: `MakersForge shall provide the Recruitment Services to ${C} in consideration for ${C} paying the applicable Fees to ${MF}, subject to the terms and conditions of this Agreement.`,
      kind: "original",
    },
    {
      n: "2.2",
      text: `When introducing a Candidate to ${C}, ${MF} is acting as an employment agency as defined in the Conduct of Employment Agencies and Employment Business Regulations 2003.`,
      kind: "original",
    },
    { n: "2.3", text: `${MF} shall ensure that any Candidate has given their consent for their details to be submitted for any vacancy for which they are submitted.`, kind: "original" },
    {
      n: "2.4",
      text: `If more than one consultancy submits details of the same Candidate to ${C}, the consultancy that first submitted the details shall be deemed to have introduced the Candidate to ${C}.`,
      kind: "original",
    },
  ];

  // 3. Fees: the one section that differs by variant.
  const feeClauses: Clause[] =
    v.variant === "contract"
      ? [
          {
            text: `${C} shall pay the Fees to MakersForge in respect of each Candidate engaged by ${C}. The Fees are fixed at ${v.contractFee} per calendar month, or part month, for each month the Candidate is Engaged, and are invoiced monthly.`,
            kind: "new",
            note: "Contractor version of your 3.1: flat monthly fee while engaged.",
          },
        ]
      : v.variant === "permanent"
        ? [
            {
              text: `${C} shall pay the Fees to MakersForge in respect of each Candidate engaged by ${C}. The Fees are fixed at ${gbp(steps[0])}.`,
              kind: retained ? "new" : "original",
              note: retained ? `Your 3.1 at the retained price (${RETAINED_OFF * 100}% off £12,000).` : "Your clause; the figure is now a variable (was £10,000).",
            },
          ]
        : [
            {
              text: `${C} shall pay the Fees to MakersForge in respect of each Candidate engaged by ${C} for a vacancy in the Batch. The Fees are fixed per Engagement, in the order the Engagements are made: ${steps.map((x, i) => `${gbp(x)} for the ${ORD[i]}`).join(", ")}. Fees are payable only for Engagements made.`,
              kind: "new",
              note: `Your 3.1 for a batch: each hire £1,000 less than the last${retained ? `, ${RETAINED_OFF * 100}% off as it's retained` : ""}. Releasing ${n} roles and filling fewer only costs the hires made.`,
            },
          ];
  const retainerClauses: Clause[] = retained
    ? [
        {
          text: `${C} shall pay a Retainer of ${gbp(retainer)}, invoiced on signing this Agreement and payable before the first Search Week starts. The Retainer is non-refundable.`,
          kind: "new",
          note: "Confirmed: paid before the first search week.",
        },
        {
          text: `The Retainer is credited against the Fees for the first Engagements until it is used up, so that each Fee invoice is reduced by any Retainer remaining. Fees are then invoiced in full.`,
          kind: "new",
          note: "How the credit works: the account settles itself as hires happen, no end-of-batch invoice.",
        },
      ]
    : [];
  const vat: Clause = {
    text: `All Fees are inclusive of VAT where VAT applies.`,
    kind: "new",
    note: "Confirmed: you absorb VAT, so a UK client still sees £12,000.",
  };

  const fees: Clause[] = [
    ...feeClauses,
    ...retainerClauses,
    vat,
    {
      text: `The payment of the Fees shall be made by ${C} to ${MF} in the currency of ${C} choice by direct bank transfer to Makers Forge Ltd's nominated bank account within 14 days of receipt of ${MF}'s invoice.`,
      kind: "original",
    },
    {
      text: `If, following a Candidate's unsuccessful application to ${C} via ${MF}, either:`,
      kind: "original",
      sub: [
        { text: `${C} Engages that Candidate in any capacity within 12 months of ${MF} having Introduced that Candidate to ${C}; or`, kind: "original" },
        {
          text: `${C} (or ${C}'s officer, employee, agent, servant or subcontractor) refers or Introduces the Candidate to a third party, including any affiliate of ${C}, and that third party Engages the Candidate in any capacity within 12 months of MakersForge having Introduced the Candidate to ${C};`,
          kind: "original",
        },
      ],
    },
    { text: `then ${C} shall be liable to pay the Fees for the Introduction as though the Candidate was Engaged by ${C} as a result of the Introduction.`, kind: "original" },
    {
      text: `${C} may cancel or rearrange a Search Week free of charge by giving written notice at least ${v.cancelHours} hours before it starts. If ${C} cancels within ${v.cancelHours} hours of the start of a Search Week, or after it has started, ${C} shall pay a cancellation fee of ${v.cancelFee}.`,
      kind: "new",
      note: "The late-cancellation fee (in the full terms and FAQ, not the five-line summary).",
    },
  ];

  const guarantee: Clause[] = v.guarantee
    ? [
        {
          text: "Replacement Guarantee:",
          kind: "original",
          sub: [
            {
              text: `If a Candidate leaves ${C}'s employment within 8 weeks from the date of Engagement for any reason related to performance, cultural fit, or role suitability, ${MF} shall provide a free replacement candidate at no additional cost to the Client.`,
              kind: "original",
            },
          ],
        },
        {
          text: "Replacement Terms:",
          kind: "original",
          sub: [
            { text: "The replacement guarantee applies when the cause of termination is related to the Candidate's qualifications, capability, conduct, or cultural fit with the organization.", kind: "original" },
            { text: `The Client must notify ${MF} in writing within 5 business days of the Candidate's departure to invoke the replacement guarantee.`, kind: "original" },
            { text: `${MF} will commence the replacement search immediately upon notification and will use reasonable efforts to present suitable replacement candidates.`, kind: "original" },
            { text: "The replacement guarantee covers one (1) replacement candidate per original placement.", kind: "original" },
          ],
        },
        {
          text: "No Replacement shall be provided if:",
          kind: "original",
          sub: [
            { text: "The cause of termination has no bearing on the Candidate's qualifications, capability, conduct,", kind: "original" },
            { text: "The Candidate is made redundant due to organizational restructuring, budget cuts, or similar business decisions.", kind: "original" },
            { text: `No reason for termination is provided by the client to ${MF};`, kind: "original" },
            { text: "The role requirements or job description are materially changed after the original placement.", kind: "original" },
          ],
        },
      ]
    : [];

  const liability: Clause[] = [
    { text: `${C} accepts and agrees that ${MF} gives no warranty as to the suitability of any Candidate for any vacancy.`, kind: "original" },
    {
      text: `Neither ${MF} nor its staff shall be liable to ${C} for any loss, injury, damage, expense or delay incurred or suffered by ${C} arising directly or indirectly from or in any way connected with the Introduction to or the Engagement by ${C} of a Candidate, unless such loss, damage, costs or expenses are the direct result of the negligent acts or omissions of ${MF}. In particular, ${MF} shall not be liable for any loss, injury, damage, expense or delay arising from or in any way connected with:`,
      kind: "original",
      sub: [
        { text: `any failure of the Candidate to meet ${C}'s requirements for all or any of the purposes for which the Candidate is required by ${C}`, kind: "original" },
        { text: "any act or omission of a Candidate; nor", kind: "original" },
        { text: "any loss, injury, damage, expense or delay suffered by a Candidate.", kind: "original" },
      ],
    },
    {
      text: `${C} warrants and represents:`,
      kind: "original",
      sub: [
        { text: `that it shall comply with its obligations under applicable Data Protection Laws in respect of the processing of Personal Data disclosed to it by ${MF}`, kind: "original" },
        {
          text: `that it has implemented appropriate technical and organisational measures in compliance with applicable Data Protection Laws to ensure a level of security appropriate to the risk in respect of Personal Data disclosed to it by ${MF}`,
          kind: "original",
        },
        {
          text: `that it is entitled under applicable Data Protection Laws to transfer Personal Data relating to its employees and other third parties to ${MF} to the extent necessary for ${MF} to provide the Recruitment Services. ${C} shall ensure that all relevant Data Subjects have been clearly informed of, and where relevant have given their consent to, such use, processing and transfer as envisaged under this Agreement.`,
          kind: "original",
        },
      ],
    },
    {
      text: `${C} has sole responsibility for the accuracy, quality and legality of the Personal Data that it provides to ${MF} under this Agreement.`,
      kind: "fixed",
      note: 'Was "Insert Your Company Name" (a leftover from the original template).',
    },
    {
      text: `${C} agrees to indemnify ${MF} against any costs, penalties, fines, losses, charges or expenses arising out of the ${C}'s loss of Personal Data, or its unauthorised or unlawful use of Personal Data, and/or any breach of Data Protection Laws arising out of any act or omission on the part of ${C}.`,
      kind: "original",
    },
  ];

  const termination: Clause[] = [
    { text: "Either party may terminate this Agreement by providing a minimum of 6 weeks written notice to the other party.", kind: "original" },
    {
      text: `On termination of this Agreement, ${C} shall pay for all Recruitment Services provided up to the date of termination, and for all Fees and expenditure falling due for payment after the date of termination from commitments reasonably and necessarily incurred by ${MF} for the performance of the Recruitment Services prior to the date of termination.`,
      kind: "original",
    },
  ];

  const general: Clause[] = [
    {
      text: "This Agreement contains the whole Agreement between the parties and supersedes and replaces any prior written or oral Agreements, representations or understandings between them with exception given to any Non-Disclosure Agreements signed prior to the Agreement.",
      kind: "original",
    },
    {
      text: "The validity, construction and performance of this Agreement shall be governed by the laws of England and Wales, and the parties hereby submit to the non-exclusive jurisdiction of the English courts.",
      kind: "original",
    },
    {
      text: "For the purposes of the Contracts (Rights of Third Parties) Act 1999, this Agreement is not intended to, and does not, give any person who is not a party to this Agreement any right to enforce any of its provisions.",
      kind: "original",
    },
    {
      text: "This Agreement may be signed electronically, and an electronic signature shall have the same effect as a handwritten signature.",
      kind: "new",
      note: "Covers click-to-sign in the onboarding flow.",
    },
  ];

  // Number everything cleanly (Andre's original skipped 3.3).
  const number = (sectionNo: number, list: Clause[]): Clause[] =>
    list.map((c, i) => ({ ...c, n: `${sectionNo}.${i + 1}`, sub: c.sub?.map((s, j) => ({ ...s, n: `${sectionNo}.${i + 1}.${j + 1}` })) }));

  return {
    parties,
    sections: [
      { title: "1. DEFINITIONS", clauses: [{ n: "1.1", text: "In this Agreement, the following terms shall have the following meanings:", kind: "original", sub: definitions }] },
      { title: "2. Recruitment Services", clauses: services },
      { title: v.guarantee ? "3. Fees, Payment and Replacement" : "3. Fees and Payment", clauses: number(3, [...fees, ...guarantee]) },
      { title: "4. Warranties, Liability and Indemnities", clauses: number(4, liability) },
      { title: "5. Termination", clauses: number(5, termination) },
      { title: "6. General", clauses: number(6, general) },
    ],
  };
}
