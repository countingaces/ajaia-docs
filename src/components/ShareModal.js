"use client";
import { useEffect, useState } from "react";

export default function ShareModal({ documentId, ownerId, onClose }) {
  const [users, setUsers] = useState([]);
  const [shares, setShares] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/users").then((r) => r.json()).then(setUsers);
    loadShares();
  }, []);

  const loadShares = async () => {
    const res = await fetch(`/api/documents/${documentId}/share`);
    const data = await res.json();
    setShares(data);
  };

  const shareWith = async (userId) => {
    const res = await fetch(`/api/documents/${documentId}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) { setMsg("Shared!"); loadShares(); setTimeout(() => setMsg(""), 2000); }
    else { const err = await res.json(); setMsg(err.error || "Error"); }
  };

  const shareable = users.filter((u) => u.id !== ownerId && !shares.find((s) => s.user_id === u.id));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-4">Share Document</h3>

        {shares.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Currently shared with:</p>
            {shares.map((s) => (
              <div key={s.id} className="flex items-center gap-2 py-1">
                <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">
                  {s.name?.[0] || "?"}
                </div>
                <span className="text-sm">{s.name}</span>
              </div>
            ))}
          </div>
        )}

        {shareable.length > 0 ? (
          <div>
            <p className="text-sm text-gray-500 mb-2">Share with:</p>
            {shareable.map((u) => (
              <button key={u.id} onClick={() => shareWith(u.id)}
                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition text-left mb-1">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                  {u.name[0]}
                </div>
                <div>
                  <div className="text-sm font-medium">{u.name}</div>
                  <div className="text-xs text-gray-400">{u.email}</div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">Shared with all users.</p>
        )}

        {msg && <p className="text-sm text-green-600 mt-2">{msg}</p>}

        <button onClick={onClose} className="mt-4 w-full py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition">
          Close
        </button>
      </div>
    </div>
  );
}
