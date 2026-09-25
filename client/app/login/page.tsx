"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../marketing.css";
import { useAuth } from "@/context/AuthContext";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { MarketingFonts } from "@/components/marketing/MarketingFonts";
import { AuthAside } from "@/components/marketing/AuthAside";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="phq">
      <MarketingFonts />
      <SiteHeader />

      <main id="main">
        <section className="account">
          <div className="wrap">
            <div>
              <h1>Sign in</h1>
              <p className="sub">Welcome back.</p>

              <form className="form" onSubmit={handleSubmit} noValidate>
                <div className="field">
                  <label htmlFor="s-email">Email address</label>
                  <input
                    id="s-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="s-pass">Password</label>
                  <input
                    id="s-pass"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {error && (
                  <p className="formerror" role="alert">
                    {error}
                  </p>
                )}

                <button className="btn btn-ink" type="submit" disabled={submitting}>
                  {submitting ? "Signing in…" : "Sign in"}
                </button>
                <p className="alt">
                  New to PortfolioHQ? <Link className="textlink" href="/register">Open an account</Link>
                </p>
              </form>
            </div>

            <AuthAside />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
