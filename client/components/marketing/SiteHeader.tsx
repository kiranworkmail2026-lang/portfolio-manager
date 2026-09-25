"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * Marketing header. The section links point back to the home page so the
 * header works unchanged on /login, /register and /sample.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="wrap">
        <Link className="wordmark" href="/" aria-label="PortfolioHQ home">
          Portfolio<b>HQ</b>
        </Link>
        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((o) => !o)}
        >
          Menu
        </button>
        <nav className={`site-nav${open ? " open" : ""}`} id="site-nav" aria-label="Main">
          <ul>
            <li><Link href="/#value" onClick={() => setOpen(false)}>Overview</Link></li>
            <li><Link href="/#how" onClick={() => setOpen(false)}>How it works</Link></li>
            <li><Link href="/#security" onClick={() => setOpen(false)}>Security</Link></li>
            <li><Link href="/#access" onClick={() => setOpen(false)}>Access</Link></li>
          </ul>
          <Link className="signin" href="/login" onClick={() => setOpen(false)}>
            Sign in
          </Link>
          <Link className="btn btn-primary" href="/register" onClick={() => setOpen(false)}>
            Open an account
          </Link>
        </nav>
      </div>
    </header>
  );
}
