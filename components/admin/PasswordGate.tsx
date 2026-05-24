"use client";

import { useState } from "react";

interface PasswordGateProps {
  onAuthenticated: () => void;
  configured: boolean;
}

export default function PasswordGate({ onAuthenticated, configured }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!configured) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f1f5f9]">
        <div className="text-center max-w-sm p-8 bg-white rounded-xl border-2 border-gray-200">
          <div className="text-4xl mb-4">⚙️</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Admin not configured
          </h2>
          <p className="text-sm text-gray-500">
            Set <code className="bg-gray-100 px-1 rounded">ADMIN_PASSWORD</code>{" "}
            in your environment variables to enable the admin page.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        onAuthenticated();
      } else {
        const data = await res.json();
        setError(data.error || "Incorrect password");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f1f5f9]">
      <form
        onSubmit={handleSubmit}
        className="max-w-sm w-full p-8 bg-white rounded-xl border-2 border-gray-200"
      >
        <div className="text-4xl mb-4 text-center">🔐</div>
        <h2 className="text-lg font-bold text-gray-900 mb-1 text-center">
          Admin Access
        </h2>
        <p className="text-sm text-gray-500 mb-4 text-center">
          Enter the admin password to continue
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none
            ${error ? "border-red-400 bg-red-50" : "border-gray-200"} focus:border-[#dc2626]`}
        />
        {error && (
          <p className="text-xs text-red-600 mt-1.5">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full mt-4 bg-[#dc2626] text-white py-2.5 rounded-lg text-sm
                     font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Unlock"}
        </button>
      </form>
    </div>
  );
}
