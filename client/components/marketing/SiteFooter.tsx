import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link className="wordmark" href="/">
              Portfolio<b>HQ</b>
            </Link>
            <p>Treasury holdings reporting, built around the custodian file the company already receives.</p>
          </div>
          <ul>
            <li><Link href="/#value">The statement</Link></li>
            <li><Link href="/#how">How it works</Link></li>
            <li><Link href="/#security">Data handling</Link></li>
            <li><Link href="/#access">Pilot access</Link></li>
            <li><Link href="/#faq">Questions</Link></li>
            <li><Link href="/sample">Worked statement</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/login">Sign in</Link></li>
            <li><Link href="/lab">Research index</Link></li>
          </ul>
          <p className="disclaimer">
            PortfolioHQ is a holdings reporting tool only. Nothing on this website constitutes
            financial or investment advice, or a recommendation to buy or sell any security. All
            investing carries risk, and nothing here is a valuation for statutory accounts.
            Please take professional advice before making investment decisions.
          </p>
        </div>
        <div className="footer-base">
          <span>&copy; 2026 PortfolioHQ. All rights reserved.</span>
          <span>Figures shown on this site are illustrative.</span>
        </div>
      </div>
    </footer>
  );
}
