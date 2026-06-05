// Single source of truth for the public site URL. Used by sitemap, robots,
// and canonical URLs in page metadata. Override via NEXT_PUBLIC_SITE_URL on Vercel.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://portfoliomanager.store"
).replace(/\/$/, "");

export function absoluteUrl(path: string = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}
