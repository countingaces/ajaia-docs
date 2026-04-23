"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!u) { router.push("/"); return; }
    setUser(u);
    loadDocs(u.id);
  }, [router]);

  const loadDocs = async (userId) => {
    const res = await fetch(`/api/documents?userId=${userId}`);
    const data = await res.json();
    setDocs(data);
  };

  const createDoc = async () => {
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Untitled Document", content: "", ownerId: user.id }),
    });
    const doc = await res.json();
    router.push(`/documents/${doc.id}`);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("ownerId", user.id);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const doc = await res.json();
    setUploading(false);
    if (doc.id) router.push(`/documents/${doc.id}`);
    else { alert(doc.error || "Upload failed"); loadDocs(user.id); }
  };

  const logout = () => { localStorage.removeItem("currentUser"); router.push("/"); };

  const owned = docs.filter((d) => d.owner_id === user?.id);
  const shared = docs.filter((d) => d.owner_id !== user?.id);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ajaia Docs</h1>
          <p className="text-gray-500">Logged in as {user.name}</p>
        </div>
        <div className="flex gap-3">
          <label className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition">
            {uploading ? "Uploading..." : "Upload .txt / .md"}
            <input type="file" accept=".txt,.md" onChange={handleUpload} className="hidden" />
          </label>
          <button onClick={createDoc} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            + New Document
          </button>
          <button onClick={logout} className="px-4 py-2 text-sm bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition">
            Switch User
          </button>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">My Documents</h2>
        {owned.length === 0 ? (
          <p className="text-gray-400 italic">No documents yet. Create one or upload a file.</p>
        ) : (
          <div className="grid gap-3">
            {owned.map((d) => (
              <button key={d.id} onClick={() => router.push(`/documents/${d.id}`)}
                className="text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-400 transition">
                <div className="font-medium text-gray-900">{d.title}</div>
                <div className="text-xs text-gray-400 mt-1">Updated {new Date(d.updated_at).toLocaleString()}</div>
              </button>
            ))}
          </div>
        )}
      </section>

      {shared.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Shared with Me</h2>
          <div className="grid gap-3">
            {shared.map((d) => (
              <button key={d.id} onClick={() => router.push(`/documents/${d.id}`)}
                className="text-left p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-400 transition">
                <div className="font-medium text-gray-900">{d.title}</div>
                <div className="text-xs text-purple-500 mt-1">Shared by {d.owner_name || "another user"}</div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
