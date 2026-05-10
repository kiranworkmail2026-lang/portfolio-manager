import Link from "next/link";
import { notFound } from "next/navigation";
import type { PublicPost } from "@/lib/api";

export const dynamic = "force-dynamic";

async function fetchPost(slug: string): Promise<PublicPost | null> {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  try {
    const r = await fetch(`${base}/api/blog/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (!r.ok) return null;
    const json = await r.json();
    return json.data;
  } catch {
    return null;
  }
}

function formatDate(s?: string) {
  if (!s) return "";
  return new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);
  if (!post) return { title: "Not found" };
  return { title: `${post.title} | Portfolio Manager`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/blog" className="text-sm text-indigo-600 hover:underline">← All posts</Link>
      <header className="mt-4 mb-8">
        <h1 className="text-4xl font-bold leading-tight">{post.title}</h1>
        <div className="text-sm text-gray-500 mt-2">
          by {post.authorName} · {formatDate(post.publishedAt)}
        </div>
      </header>
      <div
        className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-indigo-600"
        dangerouslySetInnerHTML={{ __html: post.content || "" }}
      />
    </article>
  );
}
