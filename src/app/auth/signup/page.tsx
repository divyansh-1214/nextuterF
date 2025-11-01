"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/add`, {
        name,
        email,
        password,
      });

      if (res.status === 200 || res.status === 201) {
        // Success: redirect to login
        router.push("/auth");
        return;
      }

      setError(res.data?.message ?? "Signup failed");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 480, margin: "48px auto", padding: 20 }}>
      <h1 style={{ marginBottom: 12 }}>Create an account</h1>

      <form onSubmit={submit} aria-live="polite">
        <label htmlFor="name" style={{ display: "block", fontWeight: 600 }}>
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          style={{ width: "100%", padding: 10, marginTop: 8, marginBottom: 12 }}
          required
        />

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
          style={{ width: "100%", padding: 10, marginTop: 8, marginBottom: 12 }}
          required
        />

        <label htmlFor="confirmPassword" style={{ display: "block", fontWeight: 600 }}>
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          style={{ width: "100%", padding: 10, marginTop: 8 }}
          required
        />

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
            {loading ? "Creating account…" : "Sign up"}
          </button>

          <button
            type="button"
            onClick={() => {
              setName("");
              setEmail("");
              setPassword("");
              setConfirmPassword("");
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
        Already have an account? <a href="/auth">Sign in</a>
      </p>
    </main>
  );
}
