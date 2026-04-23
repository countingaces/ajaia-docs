"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => { setUsers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const selectUser = (user) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
    router.push("/documents");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Ajaia Docs</h1>
          <p className="text-gray-500 mt-1">Select your account to continue</p>
        </div>
        {loading ? (
          <p className="text-center text-gray-400">Loading users...</p>
        ) : (
          <div className="space-y-3">
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => selectUser(u)}
                className="w-full flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                  {u.name[0]}
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">{u.name}</div>
                  <div className="text-sm text-gray-500">{u.email}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
