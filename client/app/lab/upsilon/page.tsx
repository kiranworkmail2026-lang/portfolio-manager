import Link from "next/link";
import type { Metadata } from "next";
import "../../marketing.css";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { MarketingFonts } from "@/components/marketing/MarketingFonts";

/**
 * c23 — response time.
 *
 * Rendered on demand in BOTH versions so that the only thing differing between
 * them is the delay below. If this page were static in A and dynamic in B, the
 * change in response time would be an artefact of caching rather than the edit.
 */
export const dynamic = "force-dynamic";

/** Version A: 0. Version B: 2000. */
const DELAY_MS = 2000;

export const metadata: Metadata = {
  title: "Upsilon reference note | PortfolioHQ Lab",
  description: "A reference note used by the crawl-diff experiment. Upsilon carries no production content.",
  alternates: { canonical: "/lab/upsilon" },
};

export default async function UpsilonPage() {
  if (DELAY_MS > 0) {
    await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  }

  return (
    <div className="phq">
      <MarketingFonts />
      <SiteHeader />

      <main id="main">
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <h1 className="h2">Upsilon reference note</h1>
            </div>
            <div style={{ maxWidth: "40rem", display: "grid", gap: "1.25rem", marginTop: "1.5rem" }}>
              <p>
                This page belongs to a controlled crawl-diff experiment on PortfolioHQ. It carries
                ordinary prose so that a crawler measuring overlapping word sequences has something
                real to compare between two runs.
              </p>
              <p>
                It is rendered on demand rather than served from the build output, so that the time
                taken to answer a request is a property of the page itself and not of a cache.
              </p>
            </div>
            <p style={{ marginTop: "2rem" }}>
              <Link className="textlink" href="/lab">Back to the lab index</Link>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
