import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../../marketing.css";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { MarketingFonts } from "@/components/marketing/MarketingFonts";
import { LAB_PAGES, getLabPage } from "@/lib/labPages";

/** Unknown slugs must 404 rather than render on demand. */
export const dynamicParams = false;

export function generateStaticParams() {
  return LAB_PAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = getLabPage(params.slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.canonical ?? `/lab/${page.slug}` },
    ...(page.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export default function LabPage({ params }: { params: { slug: string } }) {
  const page = getLabPage(params.slug);
  if (!page) notFound();

  return (
    <div className="phq">
      <MarketingFonts />
      <SiteHeader />

      <main id="main">
        {page.jsonLd?.map((block, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
          />
        ))}

        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <h1 className="h2">{page.h1}</h1>
            </div>
            {page.secondH1 && <h1 className="h2">{page.secondH1}</h1>}
            <div style={{ maxWidth: "40rem", display: "grid", gap: "1.25rem", marginTop: "1.5rem" }}>
              {page.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <p style={{ marginTop: "2rem" }}>
              <Link className="textlink" href="/lab">Back to the lab index</Link>
            </p>
            {page.linksTo && page.linksTo.length > 0 && (
              <ul style={{ marginTop: "1rem", paddingLeft: "1.2rem" }}>
                {page.linksTo.map((href) => (
                  <li key={href}>
                    <Link className="textlink" href={href}>{href}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
