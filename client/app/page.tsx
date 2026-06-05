import Link from "next/link";
import type { Metadata } from "next";
import styles from "./landing.module.css";
import {
  FAQAccordion,
  SignupModalButton,
  RedirectAuthed,
} from "@/components/LandingInteractive";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "PortfolioHQ — Track your portfolio against the world's best investors",
  description:
    "Track your investments against Warren Buffett's Berkshire Hathaway 13F portfolio. Know exactly what to buy, what to reduce, and why. $5 per year.",
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    title: "PortfolioHQ — Track your portfolio against the world's best investors",
    description:
      "Track your investments against Warren Buffett's Berkshire Hathaway 13F portfolio. Know exactly what to buy, what to reduce, and why.",
    url: `${SITE_URL}/`,
    type: "website",
  },
};

const HERO_HOLDINGS = [
  { sym: "AAPL", co: "Apple Inc", pnl: "+40.6%", pnlPos: true, gap: "+2.1%", gapPos: true, action: "✓ Hold", actionAdd: true },
  { sym: "BAC", co: "Bank of America", pnl: "+18.4%", pnlPos: true, gap: "+4.8%", gapPos: false, action: "▼ Reduce $1,928", actionAdd: false },
  { sym: "KO", co: "Coca-Cola Co", pnl: "+12.3%", pnlPos: true, gap: "+9.2%", gapPos: false, action: "▼ Reduce $4,888", actionAdd: false },
  { sym: "OXY", co: "Occidental Petroleum", pnl: "+6.1%", pnlPos: true, gap: "-5.4%", gapPos: true, action: "▲ Add $1,032", actionAdd: true },
  { sym: "CVX", co: "Chevron Corp", pnl: "+20.7%", pnlPos: true, gap: "-2.3%", gapPos: true, action: "▲ Add $874", actionAdd: true },
];

const FEATURES = [
  { icon: "📊", title: "Live portfolio dashboard", body: "See your full portfolio at a glance — market value, gain/loss per position, and your allocation versus the benchmark target, all in one place." },
  { icon: "🎯", title: "Exact rebalance amounts", body: "Not just percentages — actual dollar amounts. “Add $874 to OXY” is far more useful than “you’re 2.3% underweight.”" },
  { icon: "🔄", title: "One-click price refresh", body: "Prices update instantly from live market data. Your gain/loss totals, sector breakdowns, and rebalance amounts all recalculate automatically." },
  { icon: "🏷️", title: "Sector breakdown", body: "See exactly how much you hold across Technology, Financials, Energy, Consumer Staples, and every other sector — so you understand your real exposure." },
  { icon: "📁", title: "Easy broker import", body: "Works with any broker that exports CSV. Alpaca, INDmoney, Interactive Brokers, Schwab, and more. Or paste manually — whichever is easier." },
  { icon: "🔒", title: "Your data stays private", body: "Your portfolio data is encrypted and never sold, shared, or used for advertising. It belongs to you — we are a subscription service, not a data business." },
];

const TESTIMONIALS = [
  { quote: "I've been investing for 20 years and this is the clearest portfolio tool I've used. I stopped guessing what to rebalance and just follow the numbers. Worth every penny.", attr: "Verified member" },
  { quote: "The rebalance panel is brilliant. It tells me exactly how much to add or reduce — in dollars, not confusing percentages. I acted on it last month and it paid off immediately.", attr: "Verified member" },
  { quote: "At $5 a year I thought it couldn't be good. I was wrong. The live dashboard has completely changed how I track my portfolio. I check it every morning with my coffee.", attr: "Verified member" },
];

const PRICING_FEATURES = [
  "Full portfolio dashboard with live prices",
  "Comparison against Buffett's Berkshire 13F portfolio",
  "Exact rebalance amounts in dollars",
  "Sector breakdown across your holdings",
  "Upload from any broker (CSV or manual)",
  "Unlimited portfolio refreshes",
  "Priority email support",
  "All future features included",
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
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <Link href="/login">Sign In</Link>
            <SignupModalButton className={styles.btnNav}>
              Start Free Trial
            </SignupModalButton>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <div className={styles.heroEyebrow}>Trusted by Serious Investors</div>
            <h1>
              Know exactly what to do with your <em>investments</em>
            </h1>
            <p className={styles.heroLead}>
              PortfolioHQ tracks your holdings against Warren Buffett&apos;s Berkshire Hathaway portfolio — showing you precisely which stocks to add, reduce, or hold, and by exactly how much.
            </p>
            <div className={styles.heroActions}>
              <SignupModalButton className={styles.btnPrimary}>
                Get Started — $5/year
              </SignupModalButton>
              <a href="#how-it-works" className={styles.btnSecondary}>
                See how it works ↓
              </a>
            </div>
            <div className={styles.priceCallout}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>
                <strong>$5/year</strong> — less than 2 cups of coffee. Cancel any time.
              </span>
            </div>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.heroCardTitle}>Your Portfolio — Live View</div>
            <table className={styles.miniTable}>
              <thead>
                <tr>
                  <th>Holding</th>
                  <th>P&amp;L</th>
                  <th>vs Target</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {HERO_HOLDINGS.map((h) => (
                  <tr key={h.sym}>
                    <td>
                      <span>{h.sym}</span>
                      <span className={styles.co}>{h.co}</span>
                    </td>
                    <td className={h.pnlPos ? styles.pos : styles.neg}>{h.pnl}</td>
                    <td className={h.gapPos ? styles.pos : styles.neg}>{h.gap}</td>
                    <td className={h.actionAdd ? styles.add : styles.reduce}>{h.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.heroCardFooter}>
              <span className={styles.totalVal}>$38,478</span>
              <span className={styles.totalPnl}>+$8,366 &nbsp;(+27.8%)</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className={styles.trustBar}>
        <div className={styles.trustBarInner}>
          <div className={styles.trustItem}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Bank-grade SSL encryption
          </div>
          <div className={styles.trustItem}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Your data never shared
          </div>
          <div className={styles.trustItem}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Stripe-secured payments
          </div>
          <div className={styles.trustItem}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Cancel any time, instantly
          </div>
          <div className={styles.trustItem}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Email support 7 days/week
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className={styles.section} id="how-it-works">
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>Simple Process</div>
          <h2 className={styles.sectionTitle}>Up and running in 3 minutes</h2>
          <p className={styles.sectionLead}>No spreadsheets. No confusing finance jargon. Just clear, actionable guidance.</p>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNum}>1</div>
              <h3>Upload your holdings</h3>
              <p>Download your holdings CSV from your broker (Alpaca, Interactive Brokers, Schwab, etc.) and upload it directly — or paste your positions manually in a simple format.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>2</div>
              <h3>We analyse against Berkshire</h3>
              <p>Your portfolio is instantly compared to Warren Buffett&apos;s most recent 13F filing. You see every position&apos;s target weight, your current weight, and the exact gap.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>3</div>
              <h3>Get clear actions</h3>
              <p>No guessing. You get a plain-English list: &ldquo;Add $1,032 to OXY&rdquo; or &ldquo;Reduce KO by $4,888&rdquo; — updated whenever you refresh. You decide what to act on.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={`${styles.section} ${styles.featuresBg}`} id="features">
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>What You Get</div>
          <h2 className={styles.sectionTitle}>Everything you need, nothing you don&apos;t</h2>
          <p className={styles.sectionLead}>Designed for investors who want clarity, not complexity.</p>
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

      {/* PRICING */}
      <section className={`${styles.section} ${styles.pricingBg}`} id="pricing">
        <div className={`${styles.sectionInner} ${styles.pricingInner}`}>
          <div className={styles.sectionLabel} style={{ display: "block" }}>Simple Pricing</div>
          <h2 className={styles.sectionTitle}>One plan. One price. No surprises.</h2>
          <p className={styles.sectionLead} style={{ margin: "0 auto" }}>
            We believe great investment tools should be affordable for everyone — not just hedge funds.
          </p>
          <div className={styles.pricingCard}>
            <div className={styles.pricingHeader}>
              <h3>Annual Membership</h3>
              <div className={styles.priceBig}>
                <sup>$</sup>5
              </div>
              <div className={styles.pricePeriod}>per year — billed once annually</div>
            </div>
            <div className={styles.pricingBody}>
              <ul className={styles.pricingList}>
                {PRICING_FEATURES.map((f) => (
                  <li key={f}>
                    <span className={styles.check}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <SignupModalButton className={styles.pricingCta}>
                Start Your Membership →
              </SignupModalButton>
              <p className={styles.pricingNote}>
                Secure payment via Stripe. Cancel any time. No questions asked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={`${styles.section} ${styles.testimonialsBg}`}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>Member Stories</div>
          <h2 className={styles.sectionTitle}>What our members say</h2>
          <p className={styles.sectionLead}>Real members, real results.</p>
          <div className={styles.testimonials}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={styles.testimonial}>
                <div className={styles.stars}>★★★★★</div>
                <p>&ldquo;{t.quote}&rdquo;</p>
                <div className={styles.testimonialAttr}>— {t.attr}</div>
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
            <p>Clear investment tracking for serious, experienced investors. Know what to do with your money.</p>
          </div>
          <div className={styles.footerLinks}>
            <h4>Product</h4>
            <a href="#how-it-works">How It Works</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <Link href="/dashboard">Dashboard</Link>
          </div>
          <div className={styles.footerLinks}>
            <h4>Account</h4>
            <Link href="/login">Sign In</Link>
            <Link href="/register">Create Account</Link>
            <Link href="/dashboard">My Dashboard</Link>
          </div>
          <div className={styles.footerLinks}>
            <h4>Legal</h4>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/disclaimer">Investment Disclaimer</Link>
          </div>
        </div>
        <div className={styles.disclaimer}>
          <strong>Important:</strong> PortfolioHQ is a portfolio tracking tool only. Nothing on this website constitutes financial advice, investment advice, or a recommendation to buy or sell any security. Past performance of any portfolio or strategy is not indicative of future results. All investment decisions carry risk. Please consult a qualified financial advisor before making investment decisions.
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 PortfolioHQ. All rights reserved.</p>
          <p>Made for serious investors who value clarity.</p>
        </div>
      </footer>
    </div>
  );
}
