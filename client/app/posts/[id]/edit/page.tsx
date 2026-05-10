"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { PrivateRoute } from "@/components/PrivateRoute";
import { RichTextEditor } from "@/components/RichTextEditor";
import { api, Post } from "@/lib/api";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    if (!id) return;
    api.get(`/api/posts/${id}`)
      .then((r) => {
        const p: Post = r.data.data;
        setPost(p);
        setTitle(p.title);
        setContent(p.content);
      })
      .catch((e) => setError(e?.response?.data?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  const flash = (msg: string) => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(""), 2500);
  };

  const saveDraft = async () => {
    if (!post) return;
    setSaving(true);
    setError("");
    try {
      const r = await api.patch(`/api/posts/${post.id}`, { title, content, status: "draft" });
      setPost(r.data.data);
      flash("Draft saved");
    } catch (e: any) {
      setError(e?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    if (!post) return;
    if (!title.trim()) { setError("Title required to publish"); return; }
    setSaving(true);
    setError("");
    try {
      const r = await api.patch(`/api/posts/${post.id}`, { title, content, status: "published" });
      setPost(r.data.data);
      flash("Published");
    } catch (e: any) {
      setError(e?.response?.data?.message || "Publish failed");
    } finally {
      setSaving(false);
    }
  };

  const unpublish = async () => {
    if (!post) return;
    setSaving(true);
    setError("");
    try {
      const r = await api.patch(`/api/posts/${post.id}`, { status: "draft" });
      setPost(r.data.data);
      flash("Reverted to draft");
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    if (!confirm("Delete this post permanently? This cannot be undone.")) return;
    try {
      await api.delete(`/api/posts/${post.id}`);
      router.push("/posts");
    } catch (e: any) {
      setError(e?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <PrivateRoute>
      <div className="max-w-4xl mx-auto p-6">
        {loading && <p className="text-gray-500">Loading…</p>}

        {!loading && post && (
          <>
            <div className="flex items-center justify-between mb-4">
              <Link href="/posts" className="text-sm text-indigo-600 hover:underline">← My Posts</Link>
              <span className={
                post.status === "published"
                  ? "text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                  : "text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
              }>
                {post.status}
                {post.status === "published" && post.slug && (
                  <> · <Link href={`/blog/${post.slug}`} className="text-indigo-700 underline">view</Link></>
                )}
              </span>
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              className="w-full text-3xl font-bold border-0 focus:outline-none focus:ring-0 mb-4 bg-transparent"
            />

            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Edit your content here…"
            />

            {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
            {savedMsg && <p className="text-green-600 text-sm mt-3">{savedMsg}</p>}

            <div className="flex flex-wrap items-center gap-2 mt-4">
              <button onClick={saveDraft} disabled={saving}
                className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 disabled:opacity-50">
                {saving ? "Saving…" : "Save draft"}
              </button>

              {post.status === "draft" ? (
                <button onClick={publish} disabled={saving}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
                  Publish
                </button>
              ) : (
                <>
                  <button onClick={publish} disabled={saving}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
                    Update published
                  </button>
                  <button onClick={unpublish} disabled={saving}
                    className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-4 py-2 rounded hover:bg-yellow-100">
                    Revert to draft
                  </button>
                </>
              )}

              <div className="flex-1" />
              <button onClick={handleDelete}
                className="text-red-600 hover:text-red-700 text-sm px-3 py-2">
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </PrivateRoute>
  );
}
