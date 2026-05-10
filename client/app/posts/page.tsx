"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PrivateRoute } from "@/components/PrivateRoute";
import { api, Post } from "@/lib/api";

function formatDate(s: string) {
  return new Date(s).toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api.get("/api/posts")
      .then((r) => setPosts(r.data.data))
      .catch((e) => setError(e?.response?.data?.message || "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post permanently? This cannot be undone.")) return;
    try {
      await api.delete(`/api/posts/${id}`);
      setPosts(posts.filter((p) => p.id !== id));
    } catch (e: any) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <PrivateRoute>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Posts</h1>
        </div>

        {loading && <p className="text-gray-500">Loading…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && posts.length === 0 && (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-600">
            No posts yet. Run an <Link href="/analyze" className="text-indigo-600">analysis</Link> and save it as a draft to get started.
          </div>
        )}

        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link href={`/posts/${p.id}/edit`} className="text-lg font-semibold hover:text-indigo-600 truncate">
                    {p.title || "Untitled"}
                  </Link>
                  <span className={
                    p.status === "published"
                      ? "text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded"
                      : "text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
                  }>
                    {p.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Updated {formatDate(p.updatedAt)}
                  {p.status === "published" && p.slug && (
                    <> · <Link href={`/blog/${p.slug}`} className="text-indigo-600 hover:underline">/blog/{p.slug}</Link></>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <Link href={`/posts/${p.id}/edit`} className="text-sm text-indigo-600 hover:text-indigo-700 px-3 py-1">
                  Edit
                </Link>
                <button onClick={() => handleDelete(p.id)} className="text-sm text-red-600 hover:text-red-700 px-3 py-1">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PrivateRoute>
  );
}
