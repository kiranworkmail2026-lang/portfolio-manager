import Link from "next/link";
import type { Metadata } from "next";
import "../marketing.css";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { MarketingFonts } from "@/components/marketing/MarketingFonts";
import { HUB_LINKS, getLabPage } from "@/lib/labPages";

export const metadata: Metadata = {
  title: "Lab index | PortfolioHQ",
  description: "Index of throwaway reference pages used by a controlled crawl-diff experiment.",
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
              <h1 className="h2">Lab index</h1>
              <p>
                Throwaway reference pages for a controlled crawl-diff experiment. Nothing here is
                production content, and the whole tree is removed once the test is finished.
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
                <Link className="textlink" href="/lab/upsilon">Upsilon reference note</Link>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
