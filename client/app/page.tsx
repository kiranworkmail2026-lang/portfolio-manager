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
  "Bring the custodian export your finance team already receives. PortfolioHQ returns one statement of the company’s holdings: book cost, current value and where the concentration sits.";

export const metadata: Metadata = {
  title: "PortfolioHQ — Treasury holdings reporting for finance teams",
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
    q: "What does PortfolioHQ do for a finance team?",
    a: "It turns the custodian or broker export the company already receives into one statement: book cost, carrying value, the unrealised result overall and on every line, exposure by sector and the largest issuers. Internal notes can be kept against it so the rationale for a position is still on the record at the next review.",
  },
  {
    q: "Which files and custodians work?",
    a: "Any custodian or broker that exports holdings as .xlsx or .csv. Column headings are matched flexibly, so \u201cSymbol\u201d or \u201cTicker\u201d and \u201cQuantity\u201d or \u201cShares\u201d are all recognised and an existing reporting format usually works untouched. Only a symbol and a quantity are required per line.",
  },
  {
    q: "Where do the valuations come from?",
    a: "From the file you upload. PortfolioHQ reads the current-price column in the export and reports on it, so the figures reflect the prices in that file and the date it was produced. There is no live market data feed. To bring a statement up to date, upload a fresh export. Treat the output as a management view rather than a valuation for statutory accounts.",
  },
  {
    q: "What does it cost?",
    a: "Nothing during the pilot. Getting a team on to it needs no payment details and no purchase order, so it can be trialled without opening a procurement cycle.",
  },
  {
    q: "How is company data handled?",
    a: "We never ask for custodian or bank credentials — your team uploads a file it exports itself. Passwords are hashed with bcrypt and sessions are held in httpOnly cookies that page scripts cannot read. An uploaded book can be deleted at any time. This site loads Google Tag Manager for basic web analytics, which collects ordinary usage data; holdings data is never sent to it.",
  },
  {
    q: "Is any of this investment advice?",
    a: "No. PortfolioHQ reports on the holdings you provide and nothing more. It does not give investment advice, make recommendations, execute trades, hold assets or act as a book of record for statutory reporting.",
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
              <h1 id="hero-title">The company’s holdings, on the record.</h1>
              <p className="lede">
                Upload the custodian export your finance team already receives. PortfolioHQ
                returns a considered statement of book cost, current value and issuer
                concentration — without another spreadsheet to maintain between period ends.
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
                <span>No charge while in pilot.</span> No purchase order, no payment details.
              </p>
            </div>

            <figure className="statement" aria-label="Illustrative statement of holdings" style={{ margin: 0 }}>
              <header>
                <div className="st-title">Statement of corporate holdings</div>
                <div className="st-meta">
                  Illustrative treasury book
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
                    <td>Carrying value</td>
                    <td className="num">{usd(total)}</td>
                    <td>100%</td>
                  </tr>
                </tfoot>
              </table>
              <div className="st-foot">
                <span>Unrealised gain on book cost</span>
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
              <h2 id="value-title">One statement the finance team can stand behind.</h2>
              <p>
                Corporate holdings tend to sit in custodian exports and a workbook somebody
                maintains by hand. PortfolioHQ reads the file the company already receives and
                sets out the position in a form that survives a review.
              </p>
            </div>
            <ul className="pillars">
              <li>
                <h3>Value</h3>
                <p>Book cost against carrying value, with the unrealised position stated in both dollars and percent.</p>
              </li>
              <li>
                <h3>Concentration</h3>
                <p>Exposure by sector and by issuer, so a concentration against policy is visible rather than inferred at quarter end.</p>
              </li>
              <li>
                <h3>Position</h3>
                <p>The result on every line, in one table the treasurer and the controller can both work from.</p>
              </li>
            </ul>
          </div>
        </section>

        {/* ---------- HOW IT WORKS ---------- */}
        <section className="section how" id="how" aria-labelledby="how-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="how-title">Two steps. No workbook.</h2>
              <p>Nothing to install, nothing for IT to approve, no workbook to reconcile.</p>
            </div>
            <ol className="steps" style={{ listStyle: "none", marginLeft: 0, padding: 0 }}>
              <li className="step">
                <span className="n" aria-hidden="true">1</span>
                <div>
                  <h3>Export and upload</h3>
                  <p>
                    Take the holdings file the custodian or broker already sends the company,
                    as .xlsx or .csv, and upload it. Column headings are recognised flexibly, so
                    an existing report format usually works untouched. Only a symbol and a
                    quantity are required.
                  </p>
                </div>
              </li>
              <li className="step">
                <span className="n" aria-hidden="true">2</span>
                <div>
                  <h3>Circulate the statement</h3>
                  <p>
                    Book cost, carrying value, sector and issuer exposure and the result on each
                    line, calculated from that file and ready for the month-end pack.
                  </p>
                </div>
              </li>
            </ol>

            <div className="preview">
              <div className="preview-frame" aria-label="Preview of the portfolio report">
                <div className="pv-bar">
                  <span className="wordmark">Portfolio<b>HQ</b></span>
                  <span>Treasury overview</span>
                </div>
                <dl className="pv-kpis">
                  <div><dt>Carrying value</dt><dd>{usd(total)}</dd></div>
                  <div><dt>Book cost</dt><dd>{usd(cost)}</dd></div>
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
                  <p>Largest issuers</p>
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
                  <div><dt>Position summary</dt><dd>Book cost, carrying value and the unrealised result overall.</dd></div>
                  <div><dt>Holdings schedule</dt><dd>Every line with quantity, cost basis, current price and its own result.</dd></div>
                  <div><dt>Sector exposure</dt><dd>How the book is spread, so a breach of policy limits is clear at a glance.</dd></div>
                  <div><dt>Issuer concentration</dt><dd>Holdings ranked by carrying value, largest counterparty first.</dd></div>
                  <div><dt>Internal notes</dt><dd>Record the rationale against the statement. Notes stay internal unless somebody chooses to publish them.</dd></div>
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
              <h2 id="sec-title">Built to ask the company for as little as possible.</h2>
              <p>The statement needs a list of holdings. It does not need access to the company’s accounts.</p>
            </div>
            <div>
              <ul className="facts">
                <li><h3>No custodian credentials</h3><p>Your team uploads a file it exports itself. PortfolioHQ never connects to a bank, broker or custodian.</p></li>
                <li><h3>Only what the statement needs</h3><p>A symbol and a quantity per line. Account numbers, counterparty references and signatories are never requested.</p></li>
                <li><h3>Passwords hashed with bcrypt</h3><p>No password is stored in readable form, including for administrators.</p></li>
                <li><h3>Sessions in httpOnly cookies</h3><p>Session tokens cannot be read by scripts running in the page.</p></li>
                <li><h3>Deleted on request</h3><p>Any uploaded book can be removed from the account at any time, by the people who put it there.</p></li>
                <li><h3>No procurement overhead</h3><p>An account needs a name, a work email address and a password. No payment details, no contract to negotiate first.</p></li>
              </ul>
              <div className="notadvice">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                  <circle cx="12" cy="12" r="9.5" />
                  <path d="M12 7.5v5.5M12 16.2v.3" />
                </svg>
                <p>
                  <strong>A reporting tool, not an adviser or a custodian.</strong> PortfolioHQ
                  does not give investment advice, make recommendations, execute trades, hold
                  assets or act as a book of record for statutory reporting.
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
                PortfolioHQ is offered without charge during the pilot, and getting a team on to
                it requires no payment details and no procurement cycle.
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
                <li>Sector exposure and issuer concentration</li>
                <li>.xlsx and .csv custodian exports</li>
                <li>Internal notes against each statement</li>
              </ul>
              <Link className="btn btn-primary" href="/register">Request access</Link>
              <p className="fine">No payment details, no purchase order.</p>
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
            <h2 id="closing-title">Start with the file the company already receives.</h2>
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
