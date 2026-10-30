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
  "Bring the platform or custodian export you already download for a client. PortfolioHQ turns it into a statement you can take into the review meeting: cost basis, current value and where the concentration sits.";

export const metadata: Metadata = {
  title: "PortfolioHQ — Client holdings statements for advisers",
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "PortfolioHQ — Portfolio reporting from your own file",
    description: DESCRIPTION,
    url: "/",
    type: "website",
  },
};

const FAQS = [
  {
    q: "What does PortfolioHQ do for an advice practice?",
    a: "It turns the platform or custodian export you already download for a client into one statement: cost basis, current value, the unrealised result across the book and on every line, exposure by sector and the largest holdings. File notes can be kept against it, so what was discussed at the last review is still attached to the numbers at the next one.",
  },
  {
    q: "Can I keep a separate book for each client?",
    a: "Not yet, and it is worth being clear about it. Uploads can be named, but the dashboard currently combines every uploaded book into a single view, so holding several clients in one account would blend them together. For now, work one client book at a time and delete it before uploading the next. Per-client separation is the next thing to build.",
  },
  {
    q: "Which platforms and file formats work?",
    a: "Any platform, custodian or broker that exports holdings as .xlsx or .csv. Column headings are matched flexibly, so \u201cSymbol\u201d or \u201cTicker\u201d and \u201cQuantity\u201d or \u201cShares\u201d are all recognised, and an existing export usually works untouched. Only a symbol and a quantity are required per line.",
  },
  {
    q: "Where do the valuations come from?",
    a: "From the file you upload. PortfolioHQ reads the current-price column in the export and reports on it, so the figures reflect the prices in that file and the date it was produced. There is no live market data feed. To bring a statement up to date, upload a fresh export.",
  },
  {
    q: "Is this a performance report I can give a client?",
    a: "It is a holdings statement, not a performance report. It shows cost basis, current value and the unrealised result on the positions in the file. It does not calculate time-weighted or money-weighted returns, does not account for contributions and withdrawals, and is not prepared to any regulatory reporting standard. Treat it as a clear view of what a client holds today, not as a return figure you can publish.",
  },
  {
    q: "How is client data handled?",
    a: "We never ask for platform or custodian credentials \u2014 you upload a file you export yourself. The statement needs only a symbol and a quantity per line, so client names and account numbers need not be in the file at all. Passwords are hashed with bcrypt and sessions are held in httpOnly cookies that page scripts cannot read. An uploaded book can be deleted at any time. This site loads Google Tag Manager for basic web analytics; holdings data is never sent to it.",
  },
  {
    q: "What does it cost?",
    a: "Nothing during the pilot. There is no per-seat licence and no payment details, so a practice can try it on one client book before committing anything.",
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
              <h1 id="hero-title">Statements your clients actually read.</h1>
              <p className="lede">
                Upload the platform export you already download for a client. PortfolioHQ returns
                a considered statement of cost basis, current value and concentration — so the
                review meeting starts from the numbers instead of you assembling them the night
                before.
              </p>
              <div className="actions">
                <Link className="btn btn-primary" href="/register">
                  Request access
                </Link>
                <Link className="btn btn-ghost-light" href="/sample">
                  View a worked statement
                </Link>
              </div>
              <p className="fine">
                <span>No charge while in pilot.</span> No per-seat licence, no payment details.
              </p>
            </div>

            <figure className="statement" aria-label="Illustrative statement of holdings" style={{ margin: 0 }}>
              <header>
                <div className="st-title">Client holdings statement</div>
                <div className="st-meta">
                  Illustrative client book
                  <br />
                  <span>{rows.length} positions held</span>
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
                <span>Unrealised gain on cost</span>
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
              <h2 id="value-title">One statement you can put in front of a client.</h2>
              <p>
                Client holdings arrive as a platform export and end up in a workbook somebody
                rebuilds before every review. PortfolioHQ reads the file you already download and
                sets the position out in a form that holds up in the meeting and afterwards.
              </p>
            </div>
            <ul className="pillars">
              <li>
                <h3>Value</h3>
                <p>Cost basis against current value, with the unrealised position in both dollars and percent — the figure clients ask about first.</p>
              </li>
              <li>
                <h3>Concentration</h3>
                <p>Exposure by sector and by holding, so single-stock concentration is visible before a client asks about it, not after.</p>
              </li>
              <li>
                <h3>Position</h3>
                <p>The result on every line, in one table you and the client can read from together.</p>
              </li>
            </ul>
          </div>
        </section>

        {/* ---------- HOW IT WORKS ---------- */}
        <section className="section how" id="how" aria-labelledby="how-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="how-title">Two steps. No rebuilt workbook.</h2>
              <p>Nothing to install, nothing for compliance to sign off, no workbook to rebuild each review.</p>
            </div>
            <ol className="steps" style={{ listStyle: "none", marginLeft: 0, padding: 0 }}>
              <li className="step">
                <span className="n" aria-hidden="true">1</span>
                <div>
                  <h3>Export and upload</h3>
                  <p>
                    Download the client holdings file from the platform or custodian as .xlsx or
                    .csv, the way you already do, and upload it. Column headings are recognised
                    flexibly, so an existing export format usually works untouched. Only a symbol
                    and a quantity are required.
                  </p>
                </div>
              </li>
              <li className="step">
                <span className="n" aria-hidden="true">2</span>
                <div>
                  <h3>Take it into the review</h3>
                  <p>
                    Cost basis, current value, sector and holding concentration and the result on
                    each line, calculated from that file and ready for the client pack.
                  </p>
                </div>
              </li>
            </ol>

            <div className="preview">
              <div className="preview-frame" aria-label="Preview of the portfolio report">
                <div className="pv-bar">
                  <span className="wordmark">Portfolio<b>HQ</b></span>
                  <span>Client overview</span>
                </div>
                <dl className="pv-kpis">
                  <div><dt>Current value</dt><dd>{usd(total)}</dd></div>
                  <div><dt>Cost basis</dt><dd>{usd(cost)}</dd></div>
                  <div><dt>Unrealised</dt><dd className="pos">{pct(gainPct, true)}</dd></div>
                </dl>
                <div className="pv-alloc">
                  <p>Exposure by sector</p>
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
                  <p>Largest holdings</p>
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
                <h3>What the statement contains</h3>
                <dl>
                  <div><dt>Position summary</dt><dd>Cost basis, current value and the unrealised result across the book.</dd></div>
                  <div><dt>Holdings schedule</dt><dd>Every line with quantity, cost basis, current price and its own result.</dd></div>
                  <div><dt>Sector exposure</dt><dd>How the book is spread, so a drift away from the agreed mandate is clear at a glance.</dd></div>
                  <div><dt>Concentration</dt><dd>Holdings ranked by current value, so single-stock exposure is the first thing you see.</dd></div>
                  <div><dt>File notes</dt><dd>Record what was discussed and why against the statement. Notes stay private unless you choose to publish them.</dd></div>
                </dl>
                <Link className="textlink" href="/sample">View a full worked statement</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- SECURITY ---------- */}
        <section className="section security" id="security" aria-labelledby="sec-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="sec-title">Built to ask for as little client data as possible.</h2>
              <p>The statement needs a list of holdings. It does not need access to your clients’ accounts, and it does not need their names.</p>
            </div>
            <div>
              <ul className="facts">
                <li><h3>No platform credentials</h3><p>You upload a file you export yourself. PortfolioHQ never connects to a platform, custodian or broker.</p></li>
                <li><h3>Only what the statement needs</h3><p>A symbol and a quantity per line. Client names, account numbers and plan references are never requested and need not be in the file.</p></li>
                <li><h3>Passwords hashed with bcrypt</h3><p>No password is stored in readable form, including for administrators.</p></li>
                <li><h3>Sessions in httpOnly cookies</h3><p>Session tokens cannot be read by scripts running in the page.</p></li>
                <li><h3>Deleted on request</h3><p>Any uploaded book can be removed at any time, by the person who uploaded it.</p></li>
                <li><h3>No onboarding overhead</h3><p>An account needs a name, a work email address and a password. No per-seat licence and no contract to negotiate first.</p></li>
              </ul>
              <div className="notadvice">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                  <circle cx="12" cy="12" r="9.5" />
                  <path d="M12 7.5v5.5M12 16.2v.3" />
                </svg>
                <p>
                  <strong>A reporting tool, not advice and not a performance report.</strong>
                  PortfolioHQ does not give investment advice, make recommendations, execute
                  trades or hold assets. It is not a performance report prepared to any
                  regulatory standard, and it is not a book of record.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- ACCESS ---------- */}
        <section className="section access" id="access" aria-labelledby="access-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="access-title">Free while in pilot.</h2>
              <p>
                PortfolioHQ is offered without charge during the pilot. There is no per-seat
                licence and no payment details, so a practice can try it on one client book
                before committing anything.
              </p>
            </div>
            <div className="offer">
              <div className="tier">Pilot access</div>
              <div className="price">
                <b>$0</b>
                <span>during the pilot</span>
              </div>
              <ul>
                <li>Position summary and full holdings schedule</li>
                <li>Sector exposure and concentration by holding</li>
                <li>.xlsx and .csv platform exports</li>
                <li>File notes against each statement</li>
              </ul>
              <Link className="btn btn-primary" href="/register">Request access</Link>
              <p className="fine">No payment details, no per-seat licence.</p>
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
            <h2 id="closing-title">Start with one client book.</h2>
            <Link className="btn btn-primary" href="/register">Request access</Link>
            {/* Crawl-diff experiment: direct links so c03's new pages are found
                and c12's buried page drops to depth 1. Remove with the /lab tree. */}
            <p style={{ flexBasis: "100%", fontSize: ".78rem", opacity: 0.55, marginTop: "1rem" }}>
              <Link href="/lab/chain-3">Chain three</Link>{" · "}
              <Link href="/lab/psi">Psi reference note</Link>{" · "}
              <Link href="/lab/omega">Omega reference note</Link>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
