"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const password = new FormData(e.currentTarget).get("password");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (res.ok) {
      router.replace("/admin");
      router.refresh();
    } else {
      setError((await res.json().catch(() => ({}))).error || "Login failed");
    }
  };

  return (
    <main className="login">
      <form className="login-card" onSubmit={submit}>
        <span className="logo-mark">SN</span>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to edit your portfolio.</p>
        <label className="field">
          <span>Password</span>
          <input name="password" type="password" required autoFocus autoComplete="current-password" />
        </label>
        <button className="btn btn-primary" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        {error && <p className="form-status error">{error}</p>}
        <Link href="/" className="back">← Back to site</Link>
      </form>
    </main>
  );
}
