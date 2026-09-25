"use client";

import { useMemo, useState } from "react";
import { sample, usd, px, pct, cls, type SampleRow } from "@/lib/sampleData";

type Key = keyof Pick<SampleRow, "s" | "n" | "sec" | "q" | "b" | "c" | "mv" | "gl" | "glp" | "w">;

const COLUMNS: { key: Key; label: string; left?: boolean }[] = [
  { key: "s", label: "Symbol", left: true },
  { key: "n", label: "Company", left: true },
  { key: "sec", label: "Sector", left: true },
  { key: "q", label: "Quantity" },
  { key: "b", label: "Buy price" },
  { key: "c", label: "Current price" },
  { key: "mv", label: "Market value" },
  { key: "gl", label: "Gain/loss" },
  { key: "glp", label: "Gain/loss %" },
  { key: "w", label: "Weight" },
];

const TEXT_KEYS: Key[] = ["s", "n", "sec"];

export function SampleHoldingsTable() {
  const { rows } = sample;
  const [sortKey, setSortKey] = useState<Key>("mv");
  const [sortDir, setSortDir] = useState<1 | -1>(-1);
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows
      .filter((r) => !q || `${r.s} ${r.n} ${r.sec}`.toLowerCase().includes(q))
      .sort((a, b) => {
        const x = a[sortKey];
        const y = b[sortKey];
        const cmp = typeof x === "string" ? x.localeCompare(y as string) : (x as number) - (y as number);
        return cmp * sortDir;
      });
  }, [rows, sortKey, sortDir, query]);

  // Totals describe the rows actually on screen, so a filtered view never
  // shows a total that its own rows do not add up to.
  const totals = useMemo(() => {
    const mv = visible.reduce((a, r) => a + r.mv, 0);
    const cost = visible.reduce((a, r) => a + r.cost, 0);
    const w = visible.reduce((a, r) => a + r.w, 0);
    return { mv, gain: mv - cost, gainPct: cost ? (mv - cost) / cost : 0, w };
  }, [visible]);

  const filtered = query.trim().length > 0;

  const toggle = (k: Key) => {
    if (k === sortKey) setSortDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortKey(k);
      setSortDir(TEXT_KEYS.includes(k) ? 1 : -1);
    }
  };

  return (
    <section className="panel holdings" id="dash-holdings" aria-labelledby="hold-title">
      <div className="panel-head">
        <h2 id="hold-title">Holdings</h2>
        <div className="tools">
          <label htmlFor="filter" hidden>Filter holdings</label>
          <input
            id="filter"
            type="search"
            placeholder="Filter by symbol, company or sector"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="table-scroll">
        <table className="htable">
          <thead>
            <tr>
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  className={c.left ? "l" : undefined}
                  aria-sort={
                    sortKey === c.key ? (sortDir === 1 ? "ascending" : "descending") : undefined
                  }
                >
                  <button type="button" onClick={() => toggle(c.key)}>{c.label}</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length ? (
              visible.map((r) => (
                <tr key={r.s}>
                  <td className="l sym">{r.s}</td>
                  <td className="l co">{r.n}</td>
                  <td className="l co">{r.sec}</td>
                  <td>{r.q.toLocaleString("en-US")}</td>
                  <td>{px(r.b)}</td>
                  <td>{px(r.c)}</td>
                  <td>{usd(r.mv)}</td>
                  <td className={cls(r.gl)}>{usd(r.gl, true)}</td>
                  <td className={cls(r.glp)}>{pct(r.glp, true)}</td>
                  <td>{pct(r.w)}</td>
                </tr>
              ))
            ) : (
              <tr className="empty-row">
                <td colSpan={10}>
                  No holdings match &ldquo;{query}&rdquo;. Clear the filter to see all positions.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td className="l" colSpan={6}>
                {filtered ? `Total of ${visible.length} matching` : "Total"}
              </td>
              <td>{usd(totals.mv)}</td>
              <td className={cls(totals.gain)}>{usd(totals.gain, true)}</td>
              <td className={cls(totals.gain)}>{pct(totals.gainPct, true)}</td>
              <td>{pct(totals.w)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
