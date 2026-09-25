"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../app/landing.module.css";

type FAQ = { q: string; a: string };

const FAQS: FAQ[] = [
  {
    q: "What does PortfolioHQ actually do?",
    a: "You upload a spreadsheet of your holdings and it becomes a dashboard: total invested, current value, overall profit or loss, a sector allocation chart, your largest positions by value, and a table showing gain or loss for every position. You can also write notes on what you find and publish them to the blog.",
  },
  {
    q: "What file formats and brokers work?",
    a: "Any .xlsx or .csv file works, from any broker that can export one — or you can build the sheet yourself. Column headers are matched case-insensitively and common aliases are accepted, so “ticker” or “symbol”, “qty”, “shares” or “quantity” all work. Only a symbol and a quantity are required per row; name, buy price, current price, sector and asset type are optional.",
  },
  {
    q: "Does it fetch live market prices?",
    a: "No. Current prices come from the current-price column in the file you upload, so your dashboard reflects the prices in that export. To update your figures, upload a fresh export from your broker. There is no live market data feed at the moment.",
  },
  {
    q: "What does it cost?",
    a: "Nothing. There is no payment, no card details and no paid tier — you create an account with a name, an email and a password, and everything described on this page is available. If paid plans are ever introduced, that will be made clear before anything changes.",
  },
  {
    q: "How is my account and data handled?",
    a: "Your password is stored only as a bcrypt hash, never in readable form, and your login session is kept in an httpOnly cookie that page scripts cannot read. Portfolios are stored against your account and you can delete any of them at any time. Note that this site loads Google Tag Manager for basic site analytics, which collects ordinary web-usage data — your holdings are not sent to it.",
  },
  {
    q: "Is any of this financial advice?",
    a: "No. PortfolioHQ shows you your own numbers and nothing more. It does not recommend what to buy or sell. Every decision is yours, and a qualified financial adviser is the right person to consult for personalised advice.",
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

/** Sends a visitor into the free /register flow. */
export function SignupButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <button className={className} onClick={() => router.push("/register")} type="button">
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
