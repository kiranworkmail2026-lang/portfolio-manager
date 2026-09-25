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

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(name, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
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
              <h1>Open an account</h1>
              <p className="sub">A name, an email address and a password. No payment details.</p>

              <form className="form" onSubmit={handleSubmit} noValidate>
                <div className="field">
                  <label htmlFor="f-name">Full name</label>
                  <input
                    id="f-name"
                    name="name"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="f-email">Email address</label>
                  <input
                    id="f-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="f-pass">Password</label>
                  <input
                    id="f-pass"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    aria-describedby="f-pass-hint"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p className="hint" id="f-pass-hint">
                    Choose a password you do not use elsewhere.
                  </p>
                </div>

                {error && (
                  <p className="formerror" role="alert">
                    {error}
                  </p>
                )}

                <button className="btn btn-ink" type="submit" disabled={submitting}>
                  {submitting ? "Opening account…" : "Open account"}
                </button>
                <p className="alt">
                  Already have an account? <Link className="textlink" href="/login">Sign in</Link>
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
