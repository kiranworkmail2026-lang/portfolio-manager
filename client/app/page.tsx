import Link from "next/link";
import type { Metadata } from "next";
import styles from "./landing.module.css";
import { FAQAccordion, SignupButton, RedirectAuthed } from "@/components/LandingInteractive";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "PortfolioHQ — Upload your holdings, see your portfolio clearly",
  description:
    "Upload a CSV or Excel export of your stock holdings and get a clear dashboard: total value, gain/loss per position, sector breakdown, and your largest positions at a glance. Free to use.",
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    title: "PortfolioHQ — Upload your holdings, see your portfolio clearly",
    description:
      "Upload a CSV or Excel export of your holdings and get a clear dashboard: total value, gain/loss, sector breakdown, and your largest positions at a glance.",
    url: `${SITE_URL}/`,
    type: "website",
  },
};

// Illustrative sample data — labelled as a sample in the UI below.
const SAMPLE_HOLDINGS = [
  { sym: "AAPL", co: "Apple Inc", qty: "50", buy: "$142.50", cur: "$178.20", pnl: "+25.1%", pnlPos: true },
  { sym: "MSFT", co: "Microsoft Corp", qty: "30", buy: "$280.00", cur: "$338.50", pnl: "+20.9%", pnlPos: true },
  { sym: "VTI", co: "Vanguard Total Market", qty: "100", buy: "$200.00", cur: "$220.50", pnl: "+10.3%", pnlPos: true },
  { sym: "KO", co: "Coca-Cola Co", qty: "80", buy: "$61.40", cur: "$58.90", pnl: "-4.1%", pnlPos: false },
  { sym: "CVX", co: "Chevron Corp", qty: "25", buy: "$155.00", cur: "$162.30", pnl: "+4.7%", pnlPos: true },
];

const FEATURES = [
  {
    icon: "📊",
    title: "Portfolio dashboard",
    body: "Total invested, current value, and overall profit or loss in both dollars and percent — calculated from the holdings you upload.",
  },
  {
    icon: "📋",
    title: "Full holdings table",
    body: "Every position with symbol, company, quantity, buy price, current price, and its own gain/loss in dollars and percent.",
  },
  {
    icon: "🥧",
    title: "Sector allocation chart",
    body: "A breakdown of how your value is spread across sectors, so concentration is obvious at a glance instead of buried in a spreadsheet.",
  },
  {
    icon: "📈",
    title: "Top holdings chart",
    body: "Your largest positions by current value, ranked — a quick read on what actually drives your portfolio.",
  },
  {
    icon: "✍️",
    title: "Notes and published posts",
    body: "Write up what you find in a rich-text editor, keep it private as a draft, or publish it to the public blog.",
  },
];

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <RedirectAuthed />

      {/* Google Fonts for this page only */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@300;400;600&display=swap"
        rel="stylesheet"
      />

      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo}>
            Portfolio<span className={styles.logoAccent}>HQ</span>
          </Link>
          <div className={styles.navLinks}>
            <a href="#how-it-works">How It Works</a>
            <a href="#features">Features</a>
            <a href="#faq">FAQ</a>
            <Link href="/blog">Blog</Link>
            <Link href="/login">Sign In</Link>
            <SignupButton className={styles.btnNav}>Create free account</SignupButton>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <h1>
              See your whole portfolio <em>clearly</em>
            </h1>
            <p className={styles.heroLead}>
              Upload the holdings export from your broker and PortfolioHQ turns it into a dashboard
              — total value, gain and loss per position, sector breakdown, and your largest
              positions at a glance.
            </p>
            <div className={styles.heroActions}>
              <SignupButton className={styles.btnPrimary}>Create free account</SignupButton>
              <a href="#how-it-works" className={styles.btnSecondary}>
                See how it works ↓
              </a>
            </div>
            <div className={styles.priceCallout}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>
                <strong>Free to use.</strong> No card, no payment details — just a name, email and password.
              </span>
            </div>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.heroCardTitle}>Holdings table — sample data</div>
            <table className={styles.miniTable}>
              <thead>
                <tr>
                  <th>Holding</th>
                  <th>Qty</th>
                  <th>Buy</th>
                  <th>Current</th>
                  <th>P&amp;L</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_HOLDINGS.map((h) => (
                  <tr key={h.sym}>
                    <td>
                      <span>{h.sym}</span>
                      <span className={styles.co}>{h.co}</span>
                    </td>
                    <td>{h.qty}</td>
                    <td>{h.buy}</td>
                    <td>{h.cur}</td>
                    <td className={h.pnlPos ? styles.pos : styles.neg}>{h.pnl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.heroCardFooter}>
              <span className={styles.totalVal}>Example only</span>
              <span className={styles.totalPnl}>Your numbers come from your upload</span>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S TRUE / HOW WE HANDLE THINGS */}
      <div className={styles.trustBar}>
        <div className={styles.trustBarInner}>
          <div className={styles.trustItem}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Passwords hashed with bcrypt
          </div>
          <div className={styles.trustItem}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Sessions in httpOnly cookies
          </div>
          <div className={styles.trustItem}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            .xlsx and .csv uploads
          </div>
          <div className={styles.trustItem}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete a portfolio any time
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className={styles.section} id="how-it-works">
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>Simple Process</div>
          <h2 className={styles.sectionTitle}>Two steps to a clear picture</h2>
          <p className={styles.sectionLead}>
            No spreadsheet formulas to maintain, and nothing to install.
          </p>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNum}>1</div>
              <h3>Upload your holdings</h3>
              <p>
                Export your holdings from your broker as .xlsx or .csv and upload the file. Column
                headers are matched flexibly — ticker or symbol, qty or shares, and so on. Only a
                symbol and a quantity are required.
              </p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>2</div>
              <h3>Read your dashboard</h3>
              <p>
                You get total invested, current value and overall profit or loss, plus a sector
                allocation chart, your top holdings by value, and a full table with per-position
                gain and loss.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={`${styles.section} ${styles.featuresBg}`} id="features">
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>What You Get</div>
          <h2 className={styles.sectionTitle}>What PortfolioHQ does today</h2>
          <p className={styles.sectionLead}>
            This list is what is actually built and working — nothing here is coming soon.
          </p>
          <div className={styles.featuresGrid}>
            {FEATURES.map((f) => (
              <div key={f.title} className={styles.feature}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.section} id="faq">
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>Questions Answered</div>
          <h2 className={styles.sectionTitle}>Frequently asked questions</h2>
          <FAQAccordion />
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <Link href="/" className={styles.logo}>
              Portfolio<span className={styles.logoAccent}>HQ</span>
            </Link>
            <p>Upload your holdings and see them clearly — value, gain and loss, and sector mix.</p>
          </div>
          <div className={styles.footerLinks}>
            <h4>Product</h4>
            <a href="#how-it-works">How It Works</a>
            <a href="#features">Features</a>
            <a href="#faq">FAQ</a>
            <Link href="/blog">Blog</Link>
          </div>
          <div className={styles.footerLinks}>
            <h4>Account</h4>
            <Link href="/login">Sign In</Link>
            <Link href="/register">Create Account</Link>
            <Link href="/dashboard">My Dashboard</Link>
          </div>
        </div>
        <div className={styles.disclaimer}>
          <strong>Important:</strong> PortfolioHQ is a portfolio tracking tool only.
          Nothing on this website constitutes financial advice, investment advice, or a
          recommendation to buy or sell any security. All investing carries risk. Please consult a
          qualified financial adviser before making investment decisions.
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 PortfolioHQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
