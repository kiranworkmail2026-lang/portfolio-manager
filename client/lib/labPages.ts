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
  "This page belongs to a controlled crawl-diff experiment on PortfolioHQ. It carries ordinary prose so that a crawler measuring overlapping word sequences has something real to compare between two runs.";

const FILLER_A =
  "A portfolio report is only as good as the record behind it. When a holding is entered once and never revisited, the reasoning that justified it fades, and what remains is a number without a rationale. Keeping a short written note against each position costs little at the time and saves a great deal at the next review.";

const FILLER_B =
  "Concentration is the risk that hides most easily. A portfolio can look balanced by count while two or three positions carry most of the value, and sector exposure can drift a long way from where it started without any single decision having felt wrong. Measuring allocation on every refresh is what turns that drift into something visible.";

const FILLER_C =
  "Currency, timing and fees all shape a result that a headline percentage will not show. A gain quoted before costs is not the gain that reached the account, and a figure taken on a single day can flatter or punish a position that has not actually changed. Reports should be read with those caveats in mind.";

/* ---- Version B prose ---- */

/** c10 — replaces FILLER_A on /lab/iota. Roughly a quarter of that page. */
const REWRITE_ONE =
  "Record keeping is what separates a portfolio from a list of tickers. The decision to buy is made once, under conditions that will not repeat, and the reasoning behind it decays faster than the position itself. A sentence written at the time is worth more at the next review than an hour of reconstruction afterwards.";

/** c10 — replaces FILLER_B on /lab/iota. */
const REWRITE_TWO =
  "Exposure accumulates quietly. No single purchase makes a portfolio concentrated, yet a run of individually reasonable decisions can leave most of the value resting on one sector. Measuring the spread on every refresh is the only reliable way to notice that before it matters.";

/** c14 — about fifty words appended to /lab/nu. Below the content threshold. */
const ADDENDUM =
  "One further note. Figures in this report describe the file that was uploaded and nothing beyond it, so a stale export produces a stale report. Re-uploading is the whole of the refresh procedure, and there is no background process that will do it on your behalf.";

/** c15 — one word changed per sentence on /lab/xi. Small count, wide spread. */
const LEAD_XI =
  "This page belongs to a controlled crawl-diff study on PortfolioHQ. It carries ordinary prose so that a crawler measuring overlapping word sequences has something concrete to compare between two runs.";
const FILLER_A_XI =
  "A portfolio report is only as sound as the record behind it. When a holding is entered once and never revisited, the reasoning that justified it fades, and what survives is a number without a rationale. Keeping a short written note against each position costs little at the time and saves a great deal at the following review.";
const FILLER_B_XI =
  "Concentration is the risk that hides most readily. A portfolio can look balanced by count while two or three positions carry most of the value, and sector exposure can drift a long way from where it began without any single decision having felt wrong. Measuring allocation on every refresh is what turns that drift into something observable.";

/** c18 — about five words swapped on /lab/rho. Should sit under the threshold. */
const FILLER_A_RHO =
  "A portfolio report is only as good as the record behind it. When a holding is entered once and never revisited, the logic that justified it fades, and what remains is a figure without a rationale. Keeping a brief written note against each position costs little at the time and saves a great deal at the next review.";

/** c16 — appended to /lab/omicron. About five percent of that page. */
const SMALL_BLOCK_B =
  "Read every figure here as a description of one file at one moment, not as a live valuation.";

export const LAB_PAGES: LabPage[] = [
  {
    slug: "delta",
    change: "c05 — gains meta robots noindex in B",
    title: "Delta — research note | PortfolioHQ",
    description: "Methodology record held for reference by the PortfolioHQ reporting pipeline. Not customer-facing material.",
    h1: "Delta reference note",
    body: [LEAD, FILLER_A],
  },
  {
    slug: "epsilon",
    change: "c06 — canonical points at /lab/delta in B",
    title: "Epsilon — research note | PortfolioHQ",
    description: "Working note on how a holdings export is parsed, weighted and reported. Retained for internal reference.",
    h1: "Epsilon reference note",
    body: [LEAD, FILLER_B],
  },
  {
    slug: "zeta",
    change: "c07 — title text changes in B",
    title: "Zeta — research note | PortfolioHQ",
    description: "Reference material covering valuation inputs, sector weighting and the limits of a single-file report.",
    h1: "Zeta reference note",
    body: [LEAD, FILLER_C],
    linksTo: ["/lab/mu"],
  },
  {
    slug: "eta",
    change: "c08 — meta description changes in B",
    title: "Eta — research note | PortfolioHQ",
    description: "Internal note on report construction: what is read from the upload, what is derived, and what is not.",
    h1: "Eta reference note",
    body: [LEAD, FILLER_A],
    linksTo: ["/lab/mu"],
  },
  {
    slug: "theta",
    change: "c09 — first H1 text changes in B",
    title: "Theta — research note | PortfolioHQ",
    description: "Methodology record held for reference by the PortfolioHQ reporting pipeline. Not customer-facing material.",
    h1: "Theta allocation commentary",
    body: [LEAD, FILLER_B],
    linksTo: ["/lab/mu"],
  },
  {
    slug: "iota",
    change: "c10 — about half the body is rewritten in B",
    title: "Iota — research note | PortfolioHQ",
    description: "Working note on how a holdings export is parsed, weighted and reported. Retained for internal reference.",
    h1: "Iota reference note",
    body: [LEAD, REWRITE_ONE, REWRITE_TWO, FILLER_C],
    linksTo: ["/lab/mu"],
  },
  {
    slug: "kappa",
    change: "c11 — FAQPage JSON-LD added in B. Deliberately has none here.",
    title: "Kappa — research note | PortfolioHQ",
    description: "Reference material covering valuation inputs, sector weighting and the limits of a single-file report.",
    h1: "Kappa reference note",
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
    title: "Mu — research note | PortfolioHQ",
    description: "Internal note on report construction: what is read from the upload, what is derived, and what is not.",
    h1: "Mu reference note",
    body: [LEAD, FILLER_A],
  },
  {
    slug: "xi",
    change: "c15 — one word per sentence changed in B; small count, wide spread",
    title: "Xi — research note | PortfolioHQ",
    description: "Methodology record held for reference by the PortfolioHQ reporting pipeline. Not customer-facing material.",
    h1: "Xi reference note",
    body: [LEAD_XI, FILLER_A_XI, FILLER_B_XI],
  },
  {
    slug: "omicron",
    change: "c16 — one block of about five percent rewritten in B; borderline case",
    title: "Omicron — research note | PortfolioHQ",
    description: "Working note on how a holdings export is parsed, weighted and reported. Retained for internal reference.",
    h1: "Omicron reference note",
    body: [LEAD, FILLER_A, FILLER_B, FILLER_C, SMALL_BLOCK_B],
  },
  {
    slug: "phi",
    change: "c24 — disallowed in robots.txt in B",
    title: "Phi — research note | PortfolioHQ",
    description: "Reference material covering valuation inputs, sector weighting and the limits of a single-file report.",
    h1: "Phi reference note",
    body: [LEAD, FILLER_B],
  },
  {
    slug: "psi",
    change: "c03 — new page, did not exist at crawl A",
    title: "Psi — research note | PortfolioHQ",
    description: "Internal note on report construction: what is read from the upload, what is derived, and what is not.",
    h1: "Psi reference note",
    body: [LEAD, FILLER_B],
  },
  {
    slug: "omega",
    change: "c03 — new page, did not exist at crawl A",
    title: "Omega — research note | PortfolioHQ",
    description: "Methodology record held for reference by the PortfolioHQ reporting pipeline. Not customer-facing material.",
    h1: "Omega reference note",
    body: [LEAD, FILLER_C],
  },
  {
    slug: "chain-1",
    change: "depth scaffold — first link in the chain that buries chain-3",
    title: "Chain — research note | PortfolioHQ",
    description: "Working note on how a holdings export is parsed, weighted and reported. Retained for internal reference.",
    h1: "Chain one",
    body: [LEAD],
    linksTo: ["/lab/chain-2"],
  },
  {
    slug: "chain-2",
    change: "depth scaffold — second link in the chain",
    title: "Chain — research note | PortfolioHQ",
    description: "Reference material covering valuation inputs, sector weighting and the limits of a single-file report.",
    h1: "Chain two",
    body: [LEAD],
    linksTo: ["/lab/chain-3"],
  },
  {
    slug: "chain-3",
    change: "c12 — buried at depth 4 here; linked straight from the home page in B",
    title: "Chain — research note | PortfolioHQ",
    description: "Internal note on report construction: what is read from the upload, what is derived, and what is not.",
    h1: "Chain three",
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
