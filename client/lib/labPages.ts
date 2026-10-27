/**
 * Throwaway pages for the crawl-diff field test.
 *
 * Everything here lives under /lab and exists only so each kind of row the
 * crawl diff can report is triggered exactly once, on a page that nobody
 * relies on. No page that ranks is touched.
 *
 * Version A is this file as committed on branch `crawl-lab-a`.
 * Version B edits it according to crawl-test/manifest.json.
 *
 * Delete the whole /lab tree and its footer link once the test is finished.
 */

export type JsonLd = Record<string, unknown>;

export type LabPage = {
  slug: string;
  /** Which catalogued change this page carries. Documentation only. */
  change: string;
  title: string;
  description: string;
  h1: string;
  /** Body paragraphs. The crawler compares 5-word phrases, so these are real prose. */
  body: string[];
  /** A second H1 placed below the first. Only the first should be compared. */
  secondH1?: string;
  /** Overrides the self-referencing canonical. */
  canonical?: string;
  /** Emits <meta name="robots" content="noindex">. */
  noindex?: boolean;
  /** JSON-LD blocks, emitted in array order. */
  jsonLd?: JsonLd[];
  /** Extra internal links rendered at the foot of the page. */
  linksTo?: string[];
};

const LEAD =
  "This note belongs to the PortfolioHQ research index. It records how a corporate holdings file is read and turned into a statement a finance team can circulate, and is kept for internal reference rather than as customer-facing material.";

const FILLER_A =
  "A holdings statement is only as good as the record behind it. When a position is booked once and never revisited, the rationale that justified it fades, and what reaches the board is a number nobody can speak to. A short note kept against each line costs the treasury team little at the time and saves a great deal at the next review.";

const FILLER_B =
  "Concentration is the exposure that hides most easily. A book can look diversified by line count while two or three issuers carry most of the value, and sector weighting can drift well past an investment policy limit without any single decision having felt wrong. Measuring exposure on every upload is what turns that drift into something the controller can see.";

const FILLER_C =
  "Currency, settlement timing and custody fees all shape a result that a headline percentage will not show. A gain quoted before costs is not the gain that reached the company, and a figure struck on a single valuation date can flatter or punish a line that has not actually moved. A management statement should be read with those caveats, and never mistaken for the statutory accounts.";

/* ---- Version B prose ---- */

/** c10 — replaces FILLER_A on /lab/iota. Roughly a quarter of that page. */
const REWRITE_ONE =
  "Record keeping is what separates a treasury book from a list of tickers. The decision to buy is taken once, under conditions that will not repeat, and the reasoning behind it decays faster than the position itself. A sentence written at the time is worth more at the next audit than an hour of reconstruction afterwards.";

/** c10 — replaces FILLER_B on /lab/iota. */
const REWRITE_TWO =
  "Exposure accumulates quietly. No single purchase makes a book concentrated, yet a run of individually reasonable decisions can leave most of the carrying value resting on one sector or one counterparty. Measuring the spread on every upload is the only reliable way to notice that before it reaches a committee paper.";

/** c14 — about fifty words appended to /lab/nu. Below the content threshold. */
const ADDENDUM =
  "One further note. Figures in this statement describe the custodian file that was uploaded and nothing beyond it, so a stale export produces a stale statement. Re-uploading is the whole of the refresh procedure, and no background process will do it on the finance team’s behalf.";

/** c15 — one word changed per sentence on /lab/xi. Small count, wide spread. */
const LEAD_XI =
  "This note belongs to the PortfolioHQ research library. It records how a corporate holdings file is read and turned into a statement a finance team can circulate, and is kept for internal reference rather than as customer-facing material.";
const FILLER_A_XI =
  "A holdings statement is only as sound as the record behind it. When a position is booked once and never revisited, the rationale that justified it fades, and what reaches the board is a number nobody can speak to. A short note kept against each line costs the treasury team little at the time and saves a great deal at the following review.";
const FILLER_B_XI =
  "Concentration is the exposure that hides most readily. A book can look diversified by line count while two or three issuers carry most of the value, and sector weighting can drift well past an investment policy limit without any single decision having felt wrong. Measuring exposure on every upload is what turns that drift into something the controller can observe.";

/** c18 — about five words swapped on /lab/rho. Should sit under the threshold. */
const FILLER_A_RHO =
  "A holdings statement is only as good as the record behind it. When a position is booked once and never revisited, the logic that justified it fades, and what reaches the board is a figure nobody can speak to. A brief note kept against each line costs the treasury team little at the time and saves a great deal at the next review.";

/** c16 — appended to /lab/omicron. About five percent of that page. */
const SMALL_BLOCK_B =
  "Read every figure here as a description of one custodian file at one valuation date, not as a live position.";

export const LAB_PAGES: LabPage[] = [
  {
    slug: "delta",
    change: "c05 — gains meta robots noindex in B",
    title: "Delta — treasury research note | PortfolioHQ",
    description: "Internal record of how a custodian holdings export becomes a statement the finance team can circulate. Not customer-facing material.",
    h1: "Delta — treasury research note",
    body: [LEAD, FILLER_A],
  },
  {
    slug: "epsilon",
    change: "c06 — canonical points at /lab/delta in B",
    title: "Epsilon — treasury research note | PortfolioHQ",
    description: "Working note on reading a corporate holdings book: book cost, carrying value and where issuer exposure accumulates.",
    h1: "Epsilon — treasury research note",
    body: [LEAD, FILLER_B],
  },
  {
    slug: "zeta",
    change: "c07 — title text changes in B",
    title: "Zeta — treasury research note | PortfolioHQ",
    description: "Reference material on valuation inputs, sector limits and the boundary between a management statement and the statutory accounts.",
    h1: "Zeta — treasury research note",
    body: [LEAD, FILLER_C],
    linksTo: ["/lab/mu"],
  },
  {
    slug: "eta",
    change: "c08 — meta description changes in B",
    title: "Eta — treasury research note | PortfolioHQ",
    description: "Internal note on statement construction: what is read from the custodian file, what is derived, and what is deliberately left out.",
    h1: "Eta — treasury research note",
    body: [LEAD, FILLER_A],
    linksTo: ["/lab/mu"],
  },
  {
    slug: "theta",
    change: "c09 — first H1 text changes in B",
    title: "Theta — treasury research note | PortfolioHQ",
    description: "Internal record of how a custodian holdings export becomes a statement the finance team can circulate. Not customer-facing material.",
    h1: "Theta — treasury exposure commentary",
    body: [LEAD, FILLER_B],
    linksTo: ["/lab/mu"],
  },
  {
    slug: "iota",
    change: "c10 — about half the body is rewritten in B",
    title: "Iota — treasury research note | PortfolioHQ",
    description: "Working note on reading a corporate holdings book: book cost, carrying value and where issuer exposure accumulates.",
    h1: "Iota — treasury research note",
    body: [LEAD, REWRITE_ONE, REWRITE_TWO, FILLER_C],
    linksTo: ["/lab/mu"],
  },
  {
    slug: "kappa",
    change: "c11 — FAQPage JSON-LD added in B. Deliberately has none here.",
    title: "Kappa — treasury research note | PortfolioHQ",
    description: "Reference material on valuation inputs, sector limits and the boundary between a management statement and the statutory accounts.",
    h1: "Kappa — treasury research note",
    body: [LEAD, FILLER_C],
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Where do the figures in a report come from?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Every figure is derived from the holdings file that was uploaded. Nothing is retrieved from a market data feed.",
            },
          },
          {
            "@type": "Question",
            name: "How is sector allocation calculated?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Positions are grouped by their sector column and weighted by current value, so allocation reflects what the holdings are worth rather than how many there are.",
            },
          },
        ],
      },
    ],
    linksTo: ["/lab/mu"],
  },
  {
    slug: "mu",
    change: "c13 — gains inbound links from five other lab pages in B",
    title: "Mu — treasury research note | PortfolioHQ",
    description: "Internal note on statement construction: what is read from the custodian file, what is derived, and what is deliberately left out.",
    h1: "Mu — treasury research note",
    body: [LEAD, FILLER_A],
  },
  {
    slug: "xi",
    change: "c15 — one word per sentence changed in B; small count, wide spread",
    title: "Xi — treasury research note | PortfolioHQ",
    description: "Internal record of how a custodian holdings export becomes a statement the finance team can circulate. Not customer-facing material.",
    h1: "Xi — treasury research note",
    body: [LEAD_XI, FILLER_A_XI, FILLER_B_XI],
  },
  {
    slug: "omicron",
    change: "c16 — one block of about five percent rewritten in B; borderline case",
    title: "Omicron — treasury research note | PortfolioHQ",
    description: "Working note on reading a corporate holdings book: book cost, carrying value and where issuer exposure accumulates.",
    h1: "Omicron — treasury research note",
    body: [LEAD, FILLER_A, FILLER_B, FILLER_C, SMALL_BLOCK_B],
  },
  {
    slug: "phi",
    change: "c24 — disallowed in robots.txt in B",
    title: "Phi — treasury research note | PortfolioHQ",
    description: "Reference material on valuation inputs, sector limits and the boundary between a management statement and the statutory accounts.",
    h1: "Phi — treasury research note",
    body: [LEAD, FILLER_B],
  },
  {
    slug: "psi",
    change: "c03 — new page, did not exist at crawl A",
    title: "Psi — treasury research note | PortfolioHQ",
    description: "Internal note on statement construction: what is read from the custodian file, what is derived, and what is deliberately left out.",
    h1: "Psi — treasury research note",
    body: [LEAD, FILLER_B],
  },
  {
    slug: "omega",
    change: "c03 — new page, did not exist at crawl A",
    title: "Omega — treasury research note | PortfolioHQ",
    description: "Internal record of how a custodian holdings export becomes a statement the finance team can circulate. Not customer-facing material.",
    h1: "Omega — treasury research note",
    body: [LEAD, FILLER_C],
  },
  {
    slug: "chain-1",
    change: "depth scaffold — first link in the chain that buries chain-3",
    title: "Chain — treasury research note | PortfolioHQ",
    description: "Working note on reading a corporate holdings book: book cost, carrying value and where issuer exposure accumulates.",
    h1: "Chain one — custody reconciliation",
    body: [LEAD],
    linksTo: ["/lab/chain-2"],
  },
  {
    slug: "chain-2",
    change: "depth scaffold — second link in the chain",
    title: "Chain — treasury research note | PortfolioHQ",
    description: "Reference material on valuation inputs, sector limits and the boundary between a management statement and the statutory accounts.",
    h1: "Chain two — valuation sources",
    body: [LEAD],
    linksTo: ["/lab/chain-3"],
  },
  {
    slug: "chain-3",
    change: "c12 — buried at depth 4 here; linked straight from the home page in B",
    title: "Chain — treasury research note | PortfolioHQ",
    description: "Internal note on statement construction: what is read from the custodian file, what is derived, and what is deliberately left out.",
    h1: "Chain three — policy limits",
    body: [LEAD, FILLER_C],
  },
];

/**
 * c01 — /lab/alpha no longer renders, but the hub and the sitemap still point
 * at it on purpose. The crawler must still find it, so it should be reported
 * as a status change rather than as a missing page.
 */
export const LINKED_BUT_GONE = ["alpha", "sigma", "tau"];

/** Slugs rendered by the /lab/[slug] route. */
export const LAB_SLUGS = LAB_PAGES.map((p) => p.slug);

export function getLabPage(slug: string): LabPage | undefined {
  return LAB_PAGES.find((p) => p.slug === slug);
}

/**
 * Pages the hub links to, in order. /lab/mu is listed so it is reachable, but
 * it is the hub's only inlink until version B adds five more.
 * chain-2 and chain-3 are deliberately absent so the chain stays deep.
 */
export const HUB_LINKS = [
  ...LAB_PAGES.filter((p) => p.slug !== "chain-2" && p.slug !== "chain-3").map((p) => p.slug),
  ...LINKED_BUT_GONE,
];
