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
            <p>Private portfolio reporting.</p>
          </div>
          <ul>
            <li><Link href="/#value">Overview</Link></li>
            <li><Link href="/#how">How it works</Link></li>
            <li><Link href="/#security">Security</Link></li>
            <li><Link href="/#access">Access</Link></li>
            <li><Link href="/#faq">Questions</Link></li>
            <li><Link href="/sample">Sample report</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/login">Sign in</Link></li>
          </ul>
          <p className="disclaimer">
            PortfolioHQ is a portfolio reporting tool only. Nothing on this website constitutes
            financial or investment advice, or a recommendation to buy or sell any security. All
            investing carries risk. Please consult a qualified financial adviser before making
            investment decisions.
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
