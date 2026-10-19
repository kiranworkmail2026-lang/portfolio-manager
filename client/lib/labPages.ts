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

export const LAB_PAGES: LabPage[] = [
  {
    slug: "alpha",
    change: "c01 — page 404s in B, inbound links deliberately left in place",
    title: "Alpha reference note | PortfolioHQ Lab",
    description: "A reference note used by the crawl-diff experiment. Alpha carries no production content.",
    h1: "Alpha reference note",
    body: [LEAD, FILLER_A],
  },
  {
    slug: "beta",
    change: "c02 — page and every link to it removed in B",
    title: "Beta reference note | PortfolioHQ Lab",
    description: "A reference note used by the crawl-diff experiment. Beta carries no production content.",
    h1: "Beta reference note",
    body: [LEAD, FILLER_B],
  },
  {
    slug: "gamma",
    change: "c04 — becomes a 301 redirect to /lab/delta in B",
    title: "Gamma reference note | PortfolioHQ Lab",
    description: "A reference note used by the crawl-diff experiment. Gamma carries no production content.",
    h1: "Gamma reference note",
    body: [LEAD, FILLER_C],
  },
  {
    slug: "delta",
    change: "c05 — gains meta robots noindex in B",
    title: "Delta reference note | PortfolioHQ Lab",
    description: "A reference note used by the crawl-diff experiment. Delta carries no production content.",
    h1: "Delta reference note",
    body: [LEAD, FILLER_A],
  },
  {
    slug: "epsilon",
    change: "c06 — canonical points at /lab/delta in B",
    title: "Epsilon reference note | PortfolioHQ Lab",
    description: "A reference note used by the crawl-diff experiment. Epsilon carries no production content.",
    h1: "Epsilon reference note",
    body: [LEAD, FILLER_B],
  },
  {
    slug: "zeta",
    change: "c07 — title text changes in B",
    title: "Zeta reference note | PortfolioHQ Lab",
    description: "A reference note used by the crawl-diff experiment. Zeta carries no production content.",
    h1: "Zeta reference note",
    body: [LEAD, FILLER_C],
  },
  {
    slug: "eta",
    change: "c08 — meta description changes in B",
    title: "Eta reference note | PortfolioHQ Lab",
    description: "A reference note used by the crawl-diff experiment. Eta carries no production content.",
    h1: "Eta reference note",
    body: [LEAD, FILLER_A],
  },
  {
    slug: "theta",
    change: "c09 — first H1 text changes in B",
    title: "Theta reference note | PortfolioHQ Lab",
    description: "A reference note used by the crawl-diff experiment. Theta carries no production content.",
    h1: "Theta reference note",
    body: [LEAD, FILLER_B],
  },
  {
    slug: "iota",
    change: "c10 — about half the body is rewritten in B",
    title: "Iota reference note | PortfolioHQ Lab",
    description: "A reference note used by the crawl-diff experiment. Iota carries no production content.",
    h1: "Iota reference note",
    body: [LEAD, FILLER_A, FILLER_B, FILLER_C],
  },
  {
    slug: "kappa",
    change: "c11 — FAQPage JSON-LD added in B. Deliberately has none here.",
    title: "Kappa reference note | PortfolioHQ Lab",
    description: "A reference note used by the crawl-diff experiment. Kappa carries no production content.",
    h1: "Kappa reference note",
    body: [LEAD, FILLER_C],
  },
  {
    slug: "mu",
    change: "c13 — gains inbound links from five other lab pages in B",
    title: "Mu reference note | PortfolioHQ Lab",
    description: "A reference note used by the crawl-diff experiment. Mu carries no production content.",
    h1: "Mu reference note",
    body: [LEAD, FILLER_A],
  },
  {
    slug: "nu",
    change: "c14 — roughly fifty words added in B; too small to trip the content check",
    title: "Nu reference note | PortfolioHQ Lab",
    description: "A reference note used by the crawl-diff experiment. Nu carries no production content.",
    h1: "Nu reference note",
    body: [LEAD, FILLER_B, FILLER_C],
  },
  {
    slug: "xi",
    change: "c15 — one word per sentence changed in B; small count, wide spread",
    title: "Xi reference note | PortfolioHQ Lab",
    description: "A reference note used by the crawl-diff experiment. Xi carries no production content.",
    h1: "Xi reference note",
    body: [LEAD, FILLER_A, FILLER_B],
  },
  {
    slug: "omicron",
    change: "c16 — one block of about five percent rewritten in B; borderline case",
    title: "Omicron reference note | PortfolioHQ Lab",
    description: "A reference note used by the crawl-diff experiment. Omicron carries no production content.",
    h1: "Omicron reference note",
    body: [LEAD, FILLER_A, FILLER_B, FILLER_C],
  },
  {
    slug: "pi",
    change: "c17 — trailing space appended to the title in B; should be trimmed away",
    title: "Pi reference note | PortfolioHQ Lab",
    description: "A reference note used by the crawl-diff experiment. Pi carries no production content.",
    h1: "Pi reference note",
    body: [LEAD, FILLER_B],
  },
  {
    slug: "rho",
    change: "c18 — about five words swapped in B; should fall under the threshold",
    title: "Rho reference note | PortfolioHQ Lab",
    description: "A reference note used by the crawl-diff experiment. Rho carries no production content.",
    h1: "Rho reference note",
    body: [LEAD, FILLER_A, FILLER_B, FILLER_C],
  },
  {
    slug: "sigma",
    change: "c19 — the two JSON-LD blocks below are reordered in B; should be sorted before comparison",
    title: "Sigma reference note | PortfolioHQ Lab",
    description: "A reference note used by the crawl-diff experiment. Sigma carries no production content.",
    h1: "Sigma reference note",
    body: [LEAD, FILLER_C],
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Sigma reference note",
        description: "A reference note used by the crawl-diff experiment.",
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Lab", item: "/lab" },
          { "@type": "ListItem", position: 2, name: "Sigma", item: "/lab/sigma" },
        ],
      },
    ],
  },
  {
    slug: "tau",
    change: "c20 — a second H1 is added below the first in B; only the first should count",
    title: "Tau reference note | PortfolioHQ Lab",
    description: "A reference note used by the crawl-diff experiment. Tau carries no production content.",
    h1: "Tau reference note",
    body: [LEAD, FILLER_A],
  },
  {
    slug: "phi",
    change: "c24 — disallowed in robots.txt in B",
    title: "Phi reference note | PortfolioHQ Lab",
    description: "A reference note used by the crawl-diff experiment. Phi carries no production content.",
    h1: "Phi reference note",
    body: [LEAD, FILLER_B],
  },
  {
    slug: "chain-1",
    change: "depth scaffold — first link in the chain that buries chain-3",
    title: "Chain one | PortfolioHQ Lab",
    description: "First step of the crawl-depth chain used by the crawl-diff experiment.",
    h1: "Chain one",
    body: [LEAD],
    linksTo: ["/lab/chain-2"],
  },
  {
    slug: "chain-2",
    change: "depth scaffold — second link in the chain",
    title: "Chain two | PortfolioHQ Lab",
    description: "Second step of the crawl-depth chain used by the crawl-diff experiment.",
    h1: "Chain two",
    body: [LEAD],
    linksTo: ["/lab/chain-3"],
  },
  {
    slug: "chain-3",
    change: "c12 — buried at depth 4 here; linked straight from the home page in B",
    title: "Chain three | PortfolioHQ Lab",
    description: "The deep page of the crawl-depth chain used by the crawl-diff experiment.",
    h1: "Chain three",
    body: [LEAD, FILLER_C],
  },
];

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
export const HUB_LINKS = LAB_PAGES.filter(
  (p) => p.slug !== "chain-2" && p.slug !== "chain-3"
).map((p) => p.slug);
