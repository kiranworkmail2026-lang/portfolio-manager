"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../app/landing.module.css";

type FAQ = { q: string; a: string };

const FAQS: FAQ[] = [
  {
    q: "Which famous portfolio do you track against?",
    a: "PortfolioHQ tracks your holdings against Warren Buffett's Berkshire Hathaway portfolio — sourced from publicly filed SEC 13F filings. We update the model portfolio whenever Berkshire publishes a new 13F filing (typically once per quarter, ~45 days after quarter-end).",
  },
  {
    q: "Which brokers are supported?",
    a: "Any broker that lets you export your holdings as a CSV file — including Alpaca, INDmoney, Interactive Brokers, Charles Schwab, Fidelity, TD Ameritrade, and many others. You can also enter your holdings manually in a simple format if you prefer.",
  },
  {
    q: "Is my financial data safe?",
    a: "Yes. All data is encrypted in transit and at rest. We never share, sell, or use your portfolio data for any purpose other than showing you your dashboard. We are a subscription service — your data is not our product. Payments are processed securely by Stripe.",
  },
  {
    q: "Can I cancel my membership?",
    a: "Yes, any time — instantly, from your account page, with no questions asked. If you cancel within 30 days of signing up, we'll give you a full refund. No hoops, no phone calls required.",
  },
  {
    q: "Is this financial advice?",
    a: "No. PortfolioHQ is a portfolio tracking and analysis tool. We show you how your holdings compare to a specific public portfolio — Berkshire Hathaway's 13F filing. All investment decisions are yours to make. We strongly recommend consulting a qualified financial advisor for personalised advice.",
  },
  {
    q: "How often is the benchmark portfolio updated?",
    a: "We update the benchmark portfolio every time a new 13F filing is published with the SEC — typically once per quarter. You'll see the 'last updated' date on your dashboard so you always know how fresh the data is.",
  },
];

export function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div className={styles.faqList}>
      {FAQS.map((f, i) => {
        const open = openIdx === i;
        return (
          <div key={i} className={styles.faqItem}>
            <button
              className={`${styles.faqQ} ${open ? styles.faqQOpen : ""}`}
              onClick={() => setOpenIdx(open ? null : i)}
              aria-expanded={open}
            >
              {f.q}
              <span className={styles.faqArrow}>▾</span>
            </button>
            {open && <div className={styles.faqA}>{f.a}</div>}
          </div>
        );
      })}
    </div>
  );
}

export function SignupModalButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  // For now the "Start Free Trial" CTA routes to the existing /register flow.
  // Wire to Stripe Checkout once a Payment Link is configured.
  return (
    <button
      className={className}
      onClick={() => router.push("/register")}
      type="button"
    >
      {children}
    </button>
  );
}

/**
 * Redirects logged-in visitors to /dashboard so the landing page is only
 * shown to anonymous prospects. Runs once on the client.
 */
export function RedirectAuthed() {
  const router = useRouter();
  useEffect(() => {
    let cancelled = false;
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    fetch(`${base}/api/auth/me`, { credentials: "include" })
      .then((r) => {
        if (r.ok && !cancelled) router.replace("/dashboard");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [router]);
  return null;
}
