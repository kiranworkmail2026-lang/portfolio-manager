"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Redirects logged-in visitors to /dashboard so the marketing home page is
 * only shown to anonymous prospects. Runs once on the client.
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
