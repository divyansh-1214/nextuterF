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
  const [linkedinUname, setLinkedinUname] = useState("");
  const [leetcodeUname, setLeetcodeUname] = useState("");
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");
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
    // console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
    
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/add`, {
        name,
        email,
        password,
        linkedinUname,
        leetcodeUname,
        skills,
        bio,
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
    <main style={{ maxWidth: 600, margin: "32px auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: 8, fontSize: 28, fontWeight: 700 }}>Create Your Profile</h1>
      <p style={{ marginBottom: 24, color: "#666", fontSize: 14 }}>
        Join us and build your tech portfolio
      </p>

      <form onSubmit={submit} aria-live="polite">
        {/* Personal Info Section */}
        <fieldset style={{ border: "none", padding: 0, marginBottom: 24 }}>
          <legend style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "#222" }}>
            Personal Information
          </legend>

          <label htmlFor="name" style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
            Full Name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Divyansh Srivastava"
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 16,
              border: "1px solid #ddd",
              borderRadius: 4,
              fontSize: 14,
              boxSizing: "border-box",
            }}
            required
          />

          <label htmlFor="email" style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 16,
              border: "1px solid #ddd",
              borderRadius: 4,
              fontSize: 14,
              boxSizing: "border-box",
            }}
            required
          />

          <label htmlFor="password" style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
            Password *
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 16,
              border: "1px solid #ddd",
              borderRadius: 4,
              fontSize: 14,
              boxSizing: "border-box",
            }}
            required
          />

          <label htmlFor="confirmPassword" style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
            Confirm Password *
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 16,
              border: "1px solid #ddd",
              borderRadius: 4,
              fontSize: 14,
              boxSizing: "border-box",
            }}
            required
          />
        </fieldset>

        {/* Social & Professional Section */}
        <fieldset style={{ border: "none", padding: 0, marginBottom: 24 }}>
          <legend style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "#222" }}>
            Social & Professional Profiles
          </legend>

          <label htmlFor="linkedin" style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
            LinkedIn Username
          </label>
          <input
            id="linkedin"
            type="text"
            value={linkedinUname}
            onChange={(e) => setLinkedinUname(e.target.value)}
            placeholder="divyansh-srivastava"
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 16,
              border: "1px solid #ddd",
              borderRadius: 4,
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />

          <label htmlFor="leetcode" style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
            LeetCode Username
          </label>
          <input
            id="leetcode"
            type="text"
            value={leetcodeUname}
            onChange={(e) => setLeetcodeUname(e.target.value)}
            placeholder="divyansh1200"
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 16,
              border: "1px solid #ddd",
              borderRadius: 4,
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
        </fieldset>

        {/* Skills & Bio Section */}
        <fieldset style={{ border: "none", padding: 0, marginBottom: 24 }}>
          <legend style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "#222" }}>
            Skills & Biography
          </legend>

          <label htmlFor="skills" style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
            Skills
          </label>
          <textarea
            id="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="C++, JavaScript, React, Node.js, MongoDB"
            rows={3}
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 16,
              border: "1px solid #ddd",
              borderRadius: 4,
              fontSize: 14,
              fontFamily: "sans-serif",
              boxSizing: "border-box",
            }}
          />

          <label htmlFor="bio" style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A passionate tech enthusiast exploring full-stack development and competitive programming."
            rows={4}
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 16,
              border: "1px solid #ddd",
              borderRadius: 4,
              fontSize: 14,
              fontFamily: "sans-serif",
              boxSizing: "border-box",
            }}
          />
        </fieldset>

        {error && (
          <div role="alert" style={{ color: "#b00020", marginTop: 12, marginBottom: 12, fontWeight: 600, padding: 10, backgroundColor: "#ffebee", borderRadius: 4 }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 16px",
              cursor: loading ? "not-allowed" : "pointer",
              backgroundColor: loading ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: 4,
              fontWeight: 600,
              fontSize: 14,
            }}
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
              setLinkedinUname("");
              setLeetcodeUname("");
              setSkills("");
              setBio("");
              setError(null);
            }}
            disabled={loading}
            style={{
              padding: "10px 16px",
              backgroundColor: "#f0f0f0",
              border: "1px solid #ddd",
              borderRadius: 4,
              fontWeight: 600,
              fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </form>

      <p style={{ marginTop: 24, color: "#666", fontSize: 14, textAlign: "center" }}>
        Already have an account? <a href="/auth" style={{ color: "#007bff", textDecoration: "none", fontWeight: 600 }}>Sign in</a>
      </p>
    </main>
  );
}
