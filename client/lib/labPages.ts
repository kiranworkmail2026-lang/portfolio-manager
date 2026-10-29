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
  "This note belongs to the PortfolioHQ research index. It records how a client holdings export is read and turned into a statement an adviser can take into a review, and is kept for internal reference rather than as client-facing material.";

const FILLER_A =
  "A holdings statement is only as good as the record behind it. When a position is recommended once and never revisited, the reasoning that justified it fades, and what reaches the next review is a number nobody can speak to. A short file note against each line costs minutes at the time and saves a difficult conversation later.";

const FILLER_B =
  "Concentration is the exposure that hides most easily. A client book can look diversified by holding count while two or three names carry most of the value, and the equity weighting can drift well past the agreed mandate without any single decision having felt wrong. Measuring exposure at every review is what turns that drift into something you raise rather than something you explain.";

const FILLER_C =
  "Charges, timing and contributions all shape a result that a headline percentage will not show. A gain quoted before fees is not the gain the client received, and a figure struck on a single valuation date can flatter or punish a holding that has not actually moved. A holdings statement should be read with those caveats, and never mistaken for a performance report.";

/* ---- Version B prose ---- */

/** c10 — replaces FILLER_A on /lab/iota. Roughly a quarter of that page. */
const REWRITE_ONE =
  "Record keeping is what separates a client book from a list of tickers. The recommendation is made once, under circumstances that will not repeat, and the reasoning behind it decays faster than the holding itself. A sentence written at the time is worth more at a file review than an hour of reconstruction afterwards.";

/** c10 — replaces FILLER_B on /lab/iota. */
const REWRITE_TWO =
  "Exposure accumulates quietly. No single recommendation makes a book concentrated, yet a run of individually suitable decisions can leave most of a client’s value resting on one sector or one name. Measuring the spread at every review is the only reliable way to notice that before the client does.";

/** c14 — about fifty words appended to /lab/nu. Below the content threshold. */
const ADDENDUM =
  "One further note. Figures in this statement describe the platform export that was uploaded and nothing beyond it, so a stale export produces a stale statement. Re-uploading is the whole of the refresh procedure, and no background process will do it on the practice’s behalf.";

/** c15 — one word changed per sentence on /lab/xi. Small count, wide spread. */
const LEAD_XI =
  "This note belongs to the PortfolioHQ research library. It records how a client holdings export is read and turned into a statement an adviser can take into a review, and is kept for internal reference rather than as client-facing material.";
const FILLER_A_XI =
  "A holdings statement is only as sound as the record behind it. When a position is recommended once and never revisited, the reasoning that justified it fades, and what reaches the next review is a number nobody can speak to. A short file note against each line costs minutes at the time and saves a difficult conversation afterwards.";
const FILLER_B_XI =
  "Concentration is the exposure that hides most readily. A client book can look diversified by holding count while two or three names carry most of the value, and the equity weighting can drift well past the agreed mandate without any single decision having felt wrong. Measuring exposure at every review is what turns that drift into something you raise early.";

/** c18 — about five words swapped on /lab/rho. Should sit under the threshold. */
const FILLER_A_RHO =
  "A holdings statement is only as good as the record behind it. When a position is recommended once and never revisited, the logic that justified it fades, and what reaches the next review is a figure nobody can speak to. A brief file note against each line costs minutes at the time and saves a difficult conversation later.";

/** c16 — appended to /lab/omicron. About five percent of that page. */
const SMALL_BLOCK_B =
  "Read every figure here as a description of one platform export at one valuation date, not as a live position.";

export const LAB_PAGES: LabPage[] = [
  {
    slug: "delta",
    change: "c05 — gains meta robots noindex in B",
    title: "Delta — adviser research note | PortfolioHQ",
    description: "Internal record of how a client holdings export becomes a statement an adviser can take into a review. Not client-facing material.",
    h1: "Delta — adviser research note",
    body: [LEAD, FILLER_A],
  },
  {
    slug: "epsilon",
    change: "c06 — canonical points at /lab/delta in B",
    title: "Epsilon — adviser research note | PortfolioHQ",
    description: "Working note on reading a client book: cost basis, current value and where concentration accumulates between reviews.",
    h1: "Epsilon — adviser research note",
    body: [LEAD, FILLER_B],
  },
  {
    slug: "zeta",
    change: "c07 — title text changes in B",
    title: "Zeta — adviser research note | PortfolioHQ",
    description: "Reference material on valuation inputs, mandate drift and the boundary between a holdings statement and a performance report.",
    h1: "Zeta — adviser research note",
    body: [LEAD, FILLER_C],
    linksTo: ["/lab/mu"],
  },
  {
    slug: "eta",
    change: "c08 — meta description changes in B",
    title: "Eta — adviser research note | PortfolioHQ",
    description: "Internal note on statement construction: what is read from the platform export, what is derived, and what is deliberately left out.",
    h1: "Eta — adviser research note",
    body: [LEAD, FILLER_A],
    linksTo: ["/lab/mu"],
  },
  {
    slug: "theta",
    change: "c09 — first H1 text changes in B",
    title: "Theta — adviser research note | PortfolioHQ",
    description: "Internal record of how a client holdings export becomes a statement an adviser can take into a review. Not client-facing material.",
    h1: "Theta — mandate drift commentary",
    body: [LEAD, FILLER_B],
    linksTo: ["/lab/mu"],
  },
  {
    slug: "iota",
    change: "c10 — about half the body is rewritten in B",
    title: "Iota — adviser research note | PortfolioHQ",
    description: "Working note on reading a client book: cost basis, current value and where concentration accumulates between reviews.",
    h1: "Iota — adviser research note",
    body: [LEAD, REWRITE_ONE, REWRITE_TWO, FILLER_C],
    linksTo: ["/lab/mu"],
  },
  {
    slug: "kappa",
    change: "c11 — FAQPage JSON-LD added in B. Deliberately has none here.",
    title: "Kappa — adviser research note | PortfolioHQ",
    description: "Reference material on valuation inputs, mandate drift and the boundary between a holdings statement and a performance report.",
    h1: "Kappa — adviser research note",
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
    title: "Mu — adviser research note | PortfolioHQ",
    description: "Internal note on statement construction: what is read from the platform export, what is derived, and what is deliberately left out.",
    h1: "Mu — adviser research note",
    body: [LEAD, FILLER_A],
  },
  {
    slug: "xi",
    change: "c15 — one word per sentence changed in B; small count, wide spread",
    title: "Xi — adviser research note | PortfolioHQ",
    description: "Internal record of how a client holdings export becomes a statement an adviser can take into a review. Not client-facing material.",
    h1: "Xi — adviser research note",
    body: [LEAD_XI, FILLER_A_XI, FILLER_B_XI],
  },
  {
    slug: "omicron",
    change: "c16 — one block of about five percent rewritten in B; borderline case",
    title: "Omicron — adviser research note | PortfolioHQ",
    description: "Working note on reading a client book: cost basis, current value and where concentration accumulates between reviews.",
    h1: "Omicron — adviser research note",
    body: [LEAD, FILLER_A, FILLER_B, FILLER_C, SMALL_BLOCK_B],
  },
  {
    slug: "phi",
    change: "c24 — disallowed in robots.txt in B",
    title: "Phi — adviser research note | PortfolioHQ",
    description: "Reference material on valuation inputs, mandate drift and the boundary between a holdings statement and a performance report.",
    h1: "Phi — adviser research note",
    body: [LEAD, FILLER_B],
  },
  {
    slug: "psi",
    change: "c03 — new page, did not exist at crawl A",
    title: "Psi — adviser research note | PortfolioHQ",
    description: "Internal note on statement construction: what is read from the platform export, what is derived, and what is deliberately left out.",
    h1: "Psi — adviser research note",
    body: [LEAD, FILLER_B],
  },
  {
    slug: "omega",
    change: "c03 — new page, did not exist at crawl A",
    title: "Omega — adviser research note | PortfolioHQ",
    description: "Internal record of how a client holdings export becomes a statement an adviser can take into a review. Not client-facing material.",
    h1: "Omega — adviser research note",
    body: [LEAD, FILLER_C],
  },
  {
    slug: "chain-1",
    change: "depth scaffold — first link in the chain that buries chain-3",
    title: "Chain one — adviser research note | PortfolioHQ",
    description: "Working note on reading a client book: cost basis, current value and where concentration accumulates between reviews.",
    h1: "Chain one — custody reconciliation",
    body: [LEAD],
    linksTo: ["/lab/chain-2"],
  },
  {
    slug: "chain-2",
    change: "depth scaffold — second link in the chain",
    title: "Chain two — adviser research note | PortfolioHQ",
    description: "Reference material on valuation inputs, mandate drift and the boundary between a holdings statement and a performance report.",
    h1: "Chain two — valuation sources",
    body: [LEAD],
    linksTo: ["/lab/chain-3"],
  },
  {
    slug: "chain-3",
    change: "c12 — buried at depth 4 here; linked straight from the home page in B",
    title: "Chain three — adviser research note | PortfolioHQ",
    description: "Internal note on statement construction: what is read from the platform export, what is derived, and what is deliberately left out.",
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
