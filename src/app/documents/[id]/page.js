"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Editor from "@/components/Editor";
import ShareModal from "@/components/ShareModal";

export default function DocumentEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const [doc, setDoc] = useState(null);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [user, setUser] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!u) { router.push("/"); return; }
    setUser(u);
    fetch(`/api/documents/${id}`)
      .then((r) => r.json())
      .then((data) => { setDoc(data); setTitle(data.title); })
      .catch(() => router.push("/documents"));
  }, [id, router]);

  const saveDoc = useCallback(async (content) => {
    setSaving(true);
    await fetch(`/api/documents/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    setSaving(false);
    setLastSaved(new Date());
  }, [id, title]);

  const handleDelete = async () => {
    if (!confirm("Delete this document?")) return;
    await fetch(`/api/documents/${id}`, { method: "DELETE" });
    router.push("/documents");
  };

  if (!doc) return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading...</div>;

  const isOwner = user?.id === doc.owner_id;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/documents")} className="text-gray-400 hover:text-gray-600 text-sm">
            ← Back
          </button>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => saveDoc(doc.content)}
            className="text-xl font-bold text-gray-900 border-none outline-none bg-transparent"
            placeholder="Document title"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {saving ? "Saving..." : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : ""}
          </span>
          {isOwner && (
            <button onClick={() => setShowShare(true)} className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              Share
            </button>
          )}
          {isOwner && (
            <button onClick={handleDelete} className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
              Delete
            </button>
          )}
        </div>
      </div>

      {!isOwner && (
        <div className="mb-3 px-3 py-2 bg-purple-50 text-purple-700 text-sm rounded-lg">
          This document was shared with you. You have edit access.
        </div>
      )}

      <div className="bg-white rounded-xl shadow border border-gray-200">
        <Editor content={doc.content || ""} onSave={saveDoc} />
      </div>

      {showShare && (
        <ShareModal
          documentId={id}
          ownerId={doc.owner_id}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
