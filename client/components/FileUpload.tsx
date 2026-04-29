"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export function FileUpload({ onSuccess }: { onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("My Portfolio");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setError("");
    setSuccess("");
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("name", name);
    try {
      await api.post("/api/portfolio/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Uploaded!");
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">Portfolio name</label>
        <input value={name} onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Excel file (.xlsx or .csv)</label>
        <input type="file" accept=".xlsx,.csv" required
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mt-1 block w-full text-sm" />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
      <button type="submit" disabled={uploading || !file}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
        {uploading ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}
