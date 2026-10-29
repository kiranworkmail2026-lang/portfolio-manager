import Link from "next/link";
import type { Metadata } from "next";
import "../marketing.css";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { MarketingFonts } from "@/components/marketing/MarketingFonts";
import { HUB_LINKS, getLabPage } from "@/lib/labPages";

export const metadata: Metadata = {
  title: "Adviser research index — PortfolioHQ",
  description: "Index of internal research notes covering how PortfolioHQ builds a client holdings statement from an uploaded platform export.",
  alternates: { canonical: "/lab" },
};

export default function LabIndexPage() {
  return (
    <div className="phq">
      <MarketingFonts />
      <SiteHeader />

      <main id="main">
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <h1 className="h2">Adviser research index</h1>
              <p>
                Internal research notes on how a client holdings export becomes a statement an
                adviser can take into a review. Reference material, not client-facing content.
              </p>
            </div>
            <ul style={{ marginTop: "1.5rem", paddingLeft: "1.2rem", display: "grid", gap: ".5rem" }}>
              {HUB_LINKS.map((slug) => {
                const page = getLabPage(slug);
                return (
                  <li key={slug}>
                    <Link className="textlink" href={`/lab/${slug}`}>{page?.h1 ?? slug}</Link>
                  </li>
                );
              })}
              <li>
                <Link className="textlink" href="/lab/upsilon">Upsilon — adviser research note</Link>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
