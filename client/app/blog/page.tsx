import Link from "next/link";
import type { PublicPost } from "@/lib/api";

export const dynamic = "force-dynamic";

async function fetchPosts(): Promise<PublicPost[]> {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  try {
    const r = await fetch(`${base}/api/blog`, { cache: "no-store" });
    if (!r.ok) return [];
    const json = await r.json();
    return json.data || [];
  } catch {
    return [];
  }
}

function formatDate(s?: string) {
  if (!s) return "";
  const d = new Date(s);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export const metadata = {
  title: "Blog | Portfolio Manager",
  description: "Insights, analyses, and notes on building stock portfolios.",
};

export default async function BlogPage() {
  const posts = await fetchPosts();
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold">Blog</h1>
        <p className="text-gray-600 mt-2">Insights and analyses on portfolios and investing.</p>
      </header>

      {posts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          No posts yet. Check back soon.
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((p) => (
            <article key={p.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
              <Link href={`/blog/${p.slug}`} className="block group">
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600">{p.title}</h2>
                <div className="text-sm text-gray-500 mt-1">
                  by {p.authorName} · {formatDate(p.publishedAt)}
                </div>
                <p className="text-gray-700 mt-3">{p.excerpt}</p>
                <span className="text-indigo-600 text-sm mt-3 inline-block">Read more →</span>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
