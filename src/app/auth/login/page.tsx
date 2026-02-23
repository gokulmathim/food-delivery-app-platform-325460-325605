"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { loginSchema } from "@/lib/validators";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const session = useAuthStore((s) => s.session);

  const [email, setEmail] = React.useState("customer+demo@example.com");
  const [password, setPassword] = React.useState("password123");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (session) router.replace("/dashboard");
  }, [session, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setBusy(true);
    try {
      await login(parsed.data);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container" style={{ padding: "28px 0" }}>
      <div className="card" style={{ padding: 18, maxWidth: 520 }}>
        <h1 className="h1">Login</h1>
        <p className="small" style={{ marginTop: 8 }}>
          Tip: use <code>+admin</code>, <code>+restaurant</code>, or <code>+courier</code> in email for role demo fallback.
        </p>
        <form className="stack" style={{ marginTop: 12 }} onSubmit={onSubmit}>
          <label className="stack" style={{ gap: 6 }}>
            <span className="small">Email</span>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </label>
          <label className="stack" style={{ gap: 6 }}>
            <span className="small">Password</span>
            <input
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
            />
          </label>

          {error ? (
            <div className="badge" style={{ borderColor: "rgba(239,68,68,0.45)", color: "rgba(254,202,202,0.95)" }}>
              {error}
            </div>
          ) : null}

          <button className="btn btnPrimary" type="submit" disabled={busy}>
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
