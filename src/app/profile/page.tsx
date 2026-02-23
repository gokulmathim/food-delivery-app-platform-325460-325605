"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { updateProfileSchema } from "@/lib/validators";

export default function ProfilePage() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [name, setName] = React.useState(session?.user.name ?? "");
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!session) router.replace("/auth/login");
  }, [session, router]);

  React.useEffect(() => {
    setName(session?.user.name ?? "");
  }, [session?.user.name]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    const parsed = updateProfileSchema.safeParse({ name });
    if (!parsed.success) {
      setErr(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setBusy(true);
    try {
      await updateProfile(parsed.data);
      setMsg("Profile updated.");
    } catch (e: any) {
      setErr(e?.message ?? "Failed to update profile");
    } finally {
      setBusy(false);
    }
  }

  if (!session) return null;

  return (
    <main className="container" style={{ padding: "28px 0" }}>
      <div className="card" style={{ padding: 18, maxWidth: 620 }}>
        <h1 className="h1">Profile</h1>
        <p className="small" style={{ marginTop: 8 }}>
          Signed in as <strong>{session.user.email}</strong> ({session.user.role})
        </p>

        <form className="stack" style={{ marginTop: 12 }} onSubmit={onSave}>
          <label className="stack" style={{ gap: 6 }}>
            <span className="small">Display name</span>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          {msg ? <div className="badge" style={{ borderColor: "rgba(34,197,94,0.45)", color: "rgba(187,247,208,0.95)" }}>{msg}</div> : null}
          {err ? <div className="badge" style={{ borderColor: "rgba(239,68,68,0.45)", color: "rgba(254,202,202,0.95)" }}>{err}</div> : null}

          <button className="btn btnPrimary" type="submit" disabled={busy}>
            {busy ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </main>
  );
}
