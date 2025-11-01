"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`, { email, password });

      // typical success: { token, user }
      if (res.status === 200) {
        const token = res.data?.token;
        if (token) {
          try {
            // store token locally; if your app uses cookies or httpOnly tokens change accordingly
            if (remember) localStorage.setItem("auth_token", token);
            else sessionStorage.setItem("auth_token", token);
          } catch (err) {
            // ignore storage errors
          }
        }

        // navigate to home or dashboard
        router.push("/");
        return;
      }

      setError(res.data?.message ?? "Login failed");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 480, margin: "48px auto", padding: 20 }}>
      <h1 style={{ marginBottom: 12 }}>Sign in</h1>

      <form onSubmit={submit} aria-live="polite">
        <label htmlFor="email" style={{ display: "block", fontWeight: 600 }}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          style={{ width: "100%", padding: 10, marginTop: 8, marginBottom: 12 }}
          required
        />

        <label htmlFor="password" style={{ display: "block", fontWeight: 600 }}>
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          style={{ width: "100%", padding: 10, marginTop: 8 }}
          required
        />

        <div style={{ display: "flex", alignItems: "center", marginTop: 12, gap: 8 }}>
          <input
            id="remember"
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <label htmlFor="remember">Remember me</label>
        </div>

        {error && (
          <div role="alert" style={{ color: "#b00020", marginTop: 12, fontWeight: 600 }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <button
            type="submit"
            disabled={loading}
            style={{ padding: "8px 12px", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <button
            type="button"
            onClick={() => {
              setEmail("");
              setPassword("");
              setError(null);
            }}
            disabled={loading}
            style={{ padding: "8px 12px" }}
          >
            Reset
          </button>
        </div>
      </form>

      <p style={{ marginTop: 18, color: "#666" }}>
        Don't have an account? <a href="/auth/register">Register</a>
      </p>
    </main>
  );
}
