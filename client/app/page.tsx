import Link from "next/link";
import type { Metadata } from "next";
import "./marketing.css";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { Guilloche } from "@/components/marketing/Guilloche";
import { RedirectAuthed } from "@/components/marketing/RedirectAuthed";
import { MarketingFonts } from "@/components/marketing/MarketingFonts";
import { sample, usd, pct } from "@/lib/sampleData";

const DESCRIPTION =
  "Upload the holdings export from your broker. PortfolioHQ sets out value, performance and concentration in one considered report.";

export const metadata: Metadata = {
  title: "PortfolioHQ | Private portfolio reporting",
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "PortfolioHQ | Private portfolio reporting",
    description: DESCRIPTION,
    url: "/",
    type: "website",
  },
};

const FAQS = [
  {
    q: "What does PortfolioHQ do?",
    a: "It turns the holdings export from your broker into a clear report: total invested, current value, overall gain or loss, allocation by sector, your largest positions and the result on every holding. You can also keep notes on what you find.",
  },
  {
    q: "Which files and brokers work?",
    a: "Any broker that exports holdings as .xlsx or .csv. Column headings are matched flexibly, so “Symbol” or “Ticker” and “Quantity” or “Shares” are all recognised. Only a symbol and a quantity are required.",
  },
  {
    q: "Where do current prices come from?",
    a: "From the file you upload. PortfolioHQ reads the current-price column in your export and reports on it, so your figures reflect the prices in that file. There is no live market data feed — to bring the report up to date, upload a fresh export from your broker.",
  },
  {
    q: "What does it cost?",
    a: "PortfolioHQ is complimentary at present and opening an account requires no payment details.",
  },
  {
    q: "How is my data handled?",
    a: "Passwords are hashed with bcrypt and sessions are held in httpOnly cookies that page scripts cannot read. We never ask for brokerage log-ins, and you can delete a portfolio at any time. This site loads Google Tag Manager for basic analytics, which collects ordinary web-usage data; your holdings are not sent to it.",
  },
  {
    q: "Is any of this financial advice?",
    a: "No. PortfolioHQ reports on the holdings you provide. It does not give advice, make recommendations or place trades.",
  },
];

export default function HomePage() {
  const { byValue, total, gain, gainPct, cost, rows, sectors } = sample;
  const top = byValue.slice(0, 5);
  const rest = byValue.slice(5);
  const restMv = rest.reduce((a, r) => a + r.mv, 0);
  const pmax = byValue[0].w;

  return (
    <div className="phq">
      <MarketingFonts />
      <RedirectAuthed />
      <SiteHeader />

      <main id="main">
        {/* ---------- HERO ---------- */}
        <section className="hero" aria-labelledby="hero-title">
          <Guilloche />
          <div className="wrap">
            <div>
              <h1 id="hero-title">Your holdings, set out plainly.</h1>
              <p className="lede">
                Upload the holdings export from your broker. PortfolioHQ returns a considered
                account of value, performance and concentration, with no spreadsheets to maintain.
              </p>
              <div className="actions">
                <Link className="btn btn-primary" href="/register">
                  Open an account
                </Link>
                <Link className="btn btn-ghost-light" href="/sample">
                  View a sample report
                </Link>
              </div>
              <p className="fine">
                <span>Complimentary at present.</span> No payment details required.
              </p>
            </div>

            <figure className="statement" aria-label="Illustrative statement of holdings" style={{ margin: 0 }}>
              <header>
                <div className="st-title">Statement of holdings</div>
                <div className="st-meta">
                  Illustrative portfolio
                  <br />
                  <span>{rows.length} positions</span>
                </div>
              </header>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Holding</th>
                    <th scope="col">Market value</th>
                    <th scope="col">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {top.map((r, i) => (
                    <tr key={r.s} className="reveal-row" style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
                      <td>
                        <strong>{r.s}</strong>
                        <span className="co">{r.n}</span>
                      </td>
                      <td>{usd(r.mv)}</td>
                      <td>{pct(r.w)}</td>
                    </tr>
                  ))}
                  <tr className="reveal-row" style={{ animationDelay: `${0.15 + 5 * 0.08}s` }}>
                    <td>Other holdings ({rest.length})</td>
                    <td>{usd(restMv)}</td>
                    <td>{pct(restMv / total)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td>Current value</td>
                    <td className="num">{usd(total)}</td>
                    <td>100%</td>
                  </tr>
                </tfoot>
              </table>
              <div className="st-foot">
                <span>Unrealised gain</span>
                <span className="pos num">
                  {usd(gain, true)} ({pct(gainPct, true)})
                </span>
              </div>
              <div className="seal" aria-hidden="true">P</div>
            </figure>
          </div>
        </section>

        {/* ---------- VALUE ---------- */}
        <section className="section value" id="value" aria-labelledby="value-title">
          <div className="wrap">
            <div className="intro section-head">
              <h2 id="value-title">A private view of what you own.</h2>
              <p>
                Holdings tend to live in broker exports and spreadsheets that take effort to read.
                PortfolioHQ reads the file you already have and sets out the position plainly.
              </p>
            </div>
            <ul className="pillars">
              <li>
                <h3>Value</h3>
                <p>Total invested against current value, with overall gain or loss in dollars and percent.</p>
              </li>
              <li>
                <h3>Concentration</h3>
                <p>Allocation by sector and your largest positions by value, so exposure is visible rather than inferred.</p>
              </li>
              <li>
                <h3>Result</h3>
                <p>Gain or loss on every holding, set out in a single table you can sort and search.</p>
              </li>
            </ul>
          </div>
        </section>

        {/* ---------- HOW IT WORKS ---------- */}
        <section className="section how" id="how" aria-labelledby="how-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="how-title">Two steps. No formulas.</h2>
              <p>Nothing to install and no spreadsheet to maintain.</p>
            </div>
            <ol className="steps" style={{ listStyle: "none", marginLeft: 0, padding: 0 }}>
              <li className="step">
                <span className="n" aria-hidden="true">1</span>
                <div>
                  <h3>Export and upload</h3>
                  <p>
                    Download your holdings from your broker as .xlsx or .csv and upload the file.
                    Column headings are recognised flexibly. Only a symbol and a quantity are
                    required.
                  </p>
                </div>
              </li>
              <li className="step">
                <span className="n" aria-hidden="true">2</span>
                <div>
                  <h3>Read your report</h3>
                  <p>
                    Value, gain or loss, sector allocation and your largest positions, calculated
                    from your file and ready to review.
                  </p>
                </div>
              </li>
            </ol>

            <div className="preview">
              <div className="preview-frame" aria-label="Preview of the portfolio report">
                <div className="pv-bar">
                  <span className="wordmark">Portfolio<b>HQ</b></span>
                  <span>Portfolio overview</span>
                </div>
                <dl className="pv-kpis">
                  <div><dt>Current value</dt><dd>{usd(total)}</dd></div>
                  <div><dt>Total invested</dt><dd>{usd(cost)}</dd></div>
                  <div><dt>Unrealised gain</dt><dd className="pos">{pct(gainPct, true)}</dd></div>
                </dl>
                <div className="pv-alloc">
                  <p>Allocation by sector</p>
                  <div className="pv-stack">
                    {sectors.map((s) => (
                      <span
                        key={s.name}
                        style={{ width: `${(s.w * 100).toFixed(2)}%`, background: s.col }}
                        title={`${s.name} ${pct(s.w)}`}
                      />
                    ))}
                  </div>
                  <div className="pv-legend">
                    {sectors.map((s) => (
                      <span key={s.name}>
                        <i style={{ background: s.col }} />
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pv-alloc">
                  <p>Largest positions</p>
                  <ol className="bars">
                    {byValue.slice(0, 4).map((r) => (
                      <li key={r.s}>
                        <div className="row">
                          <b>{r.s}</b>
                          <span>
                            {usd(r.mv)}
                            <em>{pct(r.w)}</em>
                          </span>
                        </div>
                        <div className="track">
                          <div className="fill" style={{ width: `${((r.w / pmax) * 100).toFixed(1)}%` }} />
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              <div className="contents">
                <h3>What the report contains</h3>
                <dl>
                  <div><dt>Portfolio summary</dt><dd>Total invested, current value and overall gain or loss.</dd></div>
                  <div><dt>Holdings table</dt><dd>Every position with quantity, buy price, current price and its own result.</dd></div>
                  <div><dt>Sector allocation</dt><dd>How your value is spread, so concentration is clear at a glance.</dd></div>
                  <div><dt>Largest positions</dt><dd>Your holdings ranked by current value.</dd></div>
                  <div><dt>Private notes</dt><dd>Record observations in a rich-text editor. Notes stay private unless you choose to publish them.</dd></div>
                </dl>
                <Link className="textlink" href="/sample">View the full sample report</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- SECURITY ---------- */}
        <section className="section security" id="security" aria-labelledby="sec-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="sec-title">Built to ask for as little as possible.</h2>
              <p>The report needs a list of holdings. It does not need access to your accounts.</p>
            </div>
            <div>
              <ul className="facts">
                <li><h3>No brokerage log-ins</h3><p>You upload a file you export yourself. PortfolioHQ never connects to your accounts.</p></li>
                <li><h3>Only what the report needs</h3><p>A symbol and a quantity for each holding. Account numbers are not required.</p></li>
                <li><h3>Passwords hashed with bcrypt</h3><p>Your password is never stored in readable form.</p></li>
                <li><h3>Sessions in httpOnly cookies</h3><p>Session tokens cannot be read by scripts running in the page.</p></li>
                <li><h3>Delete whenever you choose</h3><p>Remove a portfolio from your account at any time.</p></li>
                <li><h3>No payment details</h3><p>An account needs a name, an email address and a password. Nothing more.</p></li>
              </ul>
              <div className="notadvice">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                  <circle cx="12" cy="12" r="9.5" />
                  <path d="M12 7.5v5.5M12 16.2v.3" />
                </svg>
                <p>
                  <strong>A reporting tool, not an adviser.</strong> PortfolioHQ does not give
                  advice, make recommendations, place trades or hold assets.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- ACCESS ---------- */}
        <section className="section access" id="access" aria-labelledby="access-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="access-title">Complimentary access, for now.</h2>
              <p>
                PortfolioHQ is currently offered without charge, and opening an account requires no
                payment details.
              </p>
            </div>
            <div className="offer">
              <div className="tier">Complimentary</div>
              <div className="price">
                <b>$0</b>
                <span>at present</span>
              </div>
              <ul>
                <li>Portfolio summary and full holdings table</li>
                <li>Sector allocation and largest positions</li>
                <li>.xlsx and .csv uploads</li>
                <li>Private notes</li>
              </ul>
              <Link className="btn btn-primary" href="/register">Open an account</Link>
              <p className="fine">No payment details required.</p>
            </div>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="section faq" id="faq" aria-labelledby="faq-title">
          <div className="wrap">
            <div className="section-head"><h2 id="faq-title">Questions</h2></div>
            <div className="faq-list">
              {FAQS.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- CLOSING ---------- */}
        <section className="closing" aria-labelledby="closing-title">
          <div className="wrap">
            <h2 id="closing-title">Begin with the file you already have.</h2>
            <Link className="btn btn-primary" href="/register">Open an account</Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
