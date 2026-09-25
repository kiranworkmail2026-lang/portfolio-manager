"use client";

import Link from "next/link";
import { useState } from "react";

const SECTIONS = [
  { id: "dash-top", label: "Overview" },
  { id: "dash-holdings", label: "Holdings" },
  { id: "dash-notes", label: "Notes" },
];

/** Report chrome for the public sample. Scrolls between sections in place. */
export function SampleAppBar() {
  const [current, setCurrent] = useState("dash-top");

  const go = (id: string) => {
    setCurrent(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <header className="app-bar">
      <div className="inner">
        <Link className="wordmark" href="/" aria-label="PortfolioHQ home">
          Portfolio<b>HQ</b>
        </Link>
        <nav className="app-nav" aria-label="Report sections">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => go(s.id)}
              aria-current={current === s.id ? "true" : undefined}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <div className="app-actions">
          <Link className="btn btn-primary" href="/register">
            <span>Open an account</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
