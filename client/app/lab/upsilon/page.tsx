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
  title: "Upsilon — adviser research note | PortfolioHQ",
  description: "Internal record of how a client holdings export becomes a statement an adviser can take into a review. Not client-facing material.",
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
              <h1 className="h2">Upsilon — adviser research note</h1>
            </div>
            <div style={{ maxWidth: "40rem", display: "grid", gap: "1.25rem", marginTop: "1.5rem" }}>
              <p>
                This note belongs to the PortfolioHQ research index. It records how a client
                holdings export is read and turned into a statement an adviser can take into a
                review, and is kept for internal reference rather than as client-facing material.
              </p>
              <p>
                It is rendered on demand rather than served from the build output, so the time
                taken to answer a request is a property of the note itself and not of a cache.
              </p>
            </div>
            <p style={{ marginTop: "2rem" }}>
              <Link className="textlink" href="/lab">Back to the research index</Link>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
