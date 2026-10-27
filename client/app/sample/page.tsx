import Link from "next/link";
import type { Metadata } from "next";
import "../marketing.css";
import { MarketingFonts } from "@/components/marketing/MarketingFonts";
import { SampleAppBar } from "@/components/marketing/SampleAppBar";
import { SampleHoldingsTable } from "@/components/marketing/SampleHoldingsTable";
import { sample, usd, pct, cls } from "@/lib/sampleData";

const DESCRIPTION =
  "A worked corporate holdings statement end to end: book cost, carrying value, sector and issuer concentration and the result on each line, from an illustrative treasury book.";

export const metadata: Metadata = {
  title: "A worked treasury statement — PortfolioHQ",
  description: DESCRIPTION,
  alternates: { canonical: "/sample" },
  openGraph: {
    title: "A worked example report — PortfolioHQ",
    description: DESCRIPTION,
    url: "/sample",
    type: "website",
  },
};

/** Donut geometry, matching the design's 120×120 viewBox. */
const R = 48;
const C = 2 * Math.PI * R;

export default function SamplePage() {
  const { rows, total, cost, gain, gainPct, sectors, byValue } = sample;
  const topHolding = byValue[0];
  const max = byValue[0].w;

  let offset = 0;
  const segments = sectors.map((s) => {
    const len = s.w * C;
    const seg = { ...s, len, offset };
    offset += len;
    return seg;
  });

  return (
    <div className="phq">
      <MarketingFonts />
      <div className="app">
        <SampleAppBar />

        <div className="app-main">
          <div className="sample-note" role="note">
            <span>
              This is an illustrative treasury book, not a real company account. Request access to
              upload your own custodian export.
            </span>
            <Link href="/register">Request access</Link>
          </div>

          <div className="dash-head" id="dash-top">
            <div>
              <h1>Treasury overview</h1>
              <p>{rows.length} positions held. Illustrative data, based on custodian-export.csv.</p>
            </div>
          </div>

          <dl className="kpis">
            <div className="kpi"><dt>Carrying value</dt><dd>{usd(total)}</dd></div>
            <div className="kpi"><dt>Book cost</dt><dd>{usd(cost)}</dd></div>
            <div className="kpi">
              <dt>Unrealised on book cost</dt>
              <dd className={cls(gain)}>
                {usd(gain, true)}
                <span className={`sub ${cls(gain)}`}>{pct(gainPct, true)}</span>
              </dd>
            </div>
            <div className="kpi">
              <dt>Largest issuer</dt>
              <dd>
                {topHolding.s}
                <span className="sub">{pct(topHolding.w)} of the book</span>
              </dd>
            </div>
          </dl>

          <div className="panels">
            <section className="panel" aria-labelledby="alloc-title">
              <div className="panel-head">
                <h2 id="alloc-title">Exposure by sector</h2>
                <span>By carrying value</span>
              </div>
              <div className="panel-body alloc">
                <div className="donut">
                  <svg viewBox="0 0 120 120" role="img" aria-label="Sector allocation chart">
                    <circle cx="60" cy="60" r={R} fill="none" stroke="#ECEBE6" strokeWidth="16" />
                    {segments.map((s) => (
                      <circle
                        key={s.name}
                        cx="60"
                        cy="60"
                        r={R}
                        fill="none"
                        stroke={s.col}
                        strokeWidth="16"
                        strokeDasharray={`${Math.max(s.len - 0.8, 0)} ${C}`}
                        strokeDashoffset={-s.offset}
                        transform="rotate(-90 60 60)"
                      >
                        <title>{`${s.name}: ${pct(s.w)}`}</title>
                      </circle>
                    ))}
                  </svg>
                  <div className="centre">
                    <b>{sectors.length}</b>
                    <small>sectors</small>
                  </div>
                </div>
                <table className="legend">
                  <tbody>
                    {sectors.map((s) => (
                      <tr key={s.name}>
                        <td><i style={{ background: s.col }} />{s.name}</td>
                        <td>{usd(s.mv)}</td>
                        <td>{pct(s.w)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="panel" aria-labelledby="top-title">
              <div className="panel-head">
                <h2 id="top-title">Issuer concentration</h2>
                <span>Share of carrying value</span>
              </div>
              <div className="panel-body">
                <ol className="bars">
                  {byValue.slice(0, 5).map((r) => (
                    <li key={r.s}>
                      <div className="row">
                        <b>{r.s} <span>{r.n}</span></b>
                        <span>{usd(r.mv)}<em>{pct(r.w)}</em></span>
                      </div>
                      <div className="track">
                        <div className="fill" style={{ width: `${((r.w / max) * 100).toFixed(1)}%` }} />
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          </div>

          <SampleHoldingsTable />

          <section className="panel notes" id="dash-notes" aria-labelledby="notes-title">
            <div className="panel-head">
              <h2 id="notes-title">Notes</h2>
            </div>
            <article className="note">
              <h3>Technology weighting against policy limit</h3>
              <p>
                Technology and communication services now make up a larger share of the book than
                at acquisition, and the combined weighting is close to the single-sector limit in
                the investment policy. Worth raising with the treasurer before quarter end.
              </p>
              <p className="meta"><span className="tag">Internal</span>Illustrative note</p>
            </article>
            <article className="note">
              <h3>Two lines below cost</h3>
              <p>KO and JNJ are the two lines carrying below book cost. Revisit alongside the liquidity schedule.</p>
              <p className="meta"><span className="tag">Internal</span>Illustrative note</p>
            </article>
          </section>

          <p className="app-foot">
            PortfolioHQ is a holdings reporting tool. Every figure on this page is drawn from an
            illustrative treasury book and describes no real company. Nothing shown constitutes
            investment advice, a recommendation to buy or sell any security, or a valuation for
            statutory accounts.
          </p>
        </div>
      </div>
    </div>
  );
}
