import type { MetadataRoute } from "next";
import type { PublicPost } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600; // rebuild sitemap at most every hour

async function fetchPublishedPosts(): Promise<PublicPost[]> {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  try {
    const r = await fetch(`${base}/api/blog`, { next: { revalidate: 3600 } });
    if (!r.ok) return [];
    const json = await r.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
  ];

  const posts = await fetchPublishedPosts();
  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.publishedAt ? new Date(p.publishedAt) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries];
}
