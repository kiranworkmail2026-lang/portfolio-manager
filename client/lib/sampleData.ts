/**
 * Illustrative portfolio used by the marketing pages and the public /sample
 * report. This is demonstration data only — it never touches a user account.
 */

export type SampleHolding = {
  /** Ticker symbol */
  s: string;
  /** Company name */
  n: string;
  /** Sector */
  sec: string;
  /** Quantity held */
  q: number;
  /** Buy price */
  b: number;
  /** Current price */
  c: number;
};

export const HOLDINGS: SampleHolding[] = [
  { s: "AAPL", n: "Apple Inc.", sec: "Technology", q: 9000, b: 142.5, c: 178.2 },
  { s: "MSFT", n: "Microsoft Corp.", sec: "Technology", q: 5200, b: 280.0, c: 338.5 },
  { s: "VTI", n: "Vanguard Total Stock Market ETF", sec: "Broad market fund", q: 8500, b: 200.0, c: 220.5 },
  { s: "BRK.B", n: "Berkshire Hathaway Inc.", sec: "Financials", q: 3100, b: 305.0, c: 352.4 },
  { s: "JPM", n: "JPMorgan Chase & Co.", sec: "Financials", q: 4800, b: 138.0, c: 161.75 },
  { s: "GOOGL", n: "Alphabet Inc.", sec: "Communication services", q: 6400, b: 118.0, c: 139.8 },
  { s: "CVX", n: "Chevron Corp.", sec: "Energy", q: 5500, b: 155.0, c: 162.3 },
  { s: "JNJ", n: "Johnson & Johnson", sec: "Health care", q: 4200, b: 162.0, c: 155.3 },
  { s: "UNH", n: "UnitedHealth Group Inc.", sec: "Health care", q: 1150, b: 470.0, c: 512.6 },
  { s: "KO", n: "Coca-Cola Co.", sec: "Consumer staples", q: 11000, b: 61.4, c: 58.9 },
  { s: "PG", n: "Procter & Gamble Co.", sec: "Consumer staples", q: 3600, b: 142.0, c: 151.2 },
  { s: "LIN", n: "Linde plc", sec: "Materials", q: 1300, b: 360.0, c: 402.1 },
];

export const SECTOR_COLOURS = [
  "#1F3552",
  "#9C7A4D",
  "#5B7089",
  "#7D8A74",
  "#B9AE99",
  "#6D5C6A",
  "#93A3B5",
  "#5E4A2F",
];

export type SampleRow = SampleHolding & {
  /** Market value */
  mv: number;
  /** Total cost */
  cost: number;
  /** Gain or loss in dollars */
  gl: number;
  /** Gain or loss as a fraction of cost */
  glp: number;
  /** Share of portfolio by current value */
  w: number;
};

export type SampleSector = { name: string; mv: number; w: number; col: string };

function derive() {
  const base = HOLDINGS.map((h) => ({ ...h, mv: h.q * h.c, cost: h.q * h.b }));
  const total = base.reduce((a, r) => a + r.mv, 0);
  const cost = base.reduce((a, r) => a + r.cost, 0);

  const rows: SampleRow[] = base.map((r) => ({
    ...r,
    gl: r.mv - r.cost,
    glp: (r.mv - r.cost) / r.cost,
    w: r.mv / total,
  }));

  const grouped = rows.reduce<Record<string, { name: string; mv: number }>>((m, r) => {
    (m[r.sec] ||= { name: r.sec, mv: 0 }).mv += r.mv;
    return m;
  }, {});

  const sectors: SampleSector[] = Object.values(grouped)
    .sort((a, b) => b.mv - a.mv)
    .map((s, i) => ({ ...s, w: s.mv / total, col: SECTOR_COLOURS[i % SECTOR_COLOURS.length] }));

  return {
    rows,
    total,
    cost,
    gain: total - cost,
    gainPct: (total - cost) / cost,
    sectors,
    byValue: [...rows].sort((a, b) => b.mv - a.mv),
  };
}

export const sample = derive();

/* ---- formatting ---- */

const MINUS = "−";

/** Whole-dollar amount, optionally signed. */
export const usd = (v: number, signed = false) =>
  (signed && v > 0 ? "+" : "") +
  (v < 0 ? MINUS : "") +
  "$" +
  Math.abs(Math.round(v)).toLocaleString("en-US");

/** Price to two decimal places. */
export const px = (v: number) =>
  "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Fraction rendered as a percentage, optionally signed. */
export const pct = (v: number, signed = false, d = 1) =>
  (signed && v > 0 ? "+" : "") + (v < 0 ? MINUS : "") + (Math.abs(v) * 100).toFixed(d) + "%";

/** "pos" / "neg" / "" class for a signed figure. */
export const cls = (v: number) => (v > 0 ? "pos" : v < 0 ? "neg" : "");
