"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationsStore } from "@/stores/notificationsStore";
import { assertRuntimeConfig } from "@/lib/config";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
  return (
    <Link
      className="btn"
      href={href}
      style={{
        padding: "8px 10px",
        background: active ? "rgba(255,255,255,0.08)" : undefined
      }}
    >
      {label}
    </Link>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const session = useAuthStore((s) => s.session);
  const logout = useAuthStore((s) => s.logout);

  const unread = useNotificationsStore((s) => s.unread);
  const items = useNotificationsStore((s) => s.items);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);

  const [showNotif, setShowNotif] = React.useState(false);
  const [cfgOk, setCfgOk] = React.useState(true);

  React.useEffect(() => {
    try {
      assertRuntimeConfig();
      setCfgOk(true);
    } catch {
      setCfgOk(false);
    }
  }, []);

  const role = session?.user.role;

  return (
    <div>
      <header style={{ borderBottom: "1px solid var(--border)", position: "sticky", top: 0, backdropFilter: "blur(10px)", zIndex: 50 }}>
        <div className="container" style={{ padding: "12px 16px" }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div className="row" style={{ flexWrap: "wrap" }}>
              <Link href="/" className="row" style={{ gap: 10, paddingRight: 6 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "rgba(34,197,94,0.25)",
                    border: "1px solid rgba(34,197,94,0.45)"
                  }}
                />
                <strong>Food Delivery</strong>
              </Link>

              <div className="row" style={{ flexWrap: "wrap" }}>
                <NavLink href="/restaurants" label="Restaurants" />
                <NavLink href="/cart" label="Cart" />
                {session ? <NavLink href="/orders" label="Orders" /> : null}
                {session ? <NavLink href="/dashboard" label="Dashboard" /> : null}
              </div>
            </div>

            <div className="row" style={{ flexWrap: "wrap", justifyContent: "flex-end" }}>
              {!cfgOk ? <span className="badge">Missing env vars (see .env.example)</span> : null}
              {session ? (
                <>
                  <button className="btn" onClick={() => setShowNotif((v) => !v)} aria-expanded={showNotif} aria-controls="notif-panel">
                    Notifications {unread ? <span className="badge" style={{ marginLeft: 8 }}>{unread}</span> : null}
                  </button>
                  <NavLink href="/profile" label={session.user.name ?? "Profile"} />
                  <button className="btn btnDanger" onClick={logout}>
                    Logout
                  </button>
                  <span className="badge">Role: {role}</span>
                </>
              ) : (
                <>
                  <NavLink href="/auth/login" label="Login" />
                  <NavLink href="/auth/register" label="Register" />
                </>
              )}
            </div>
          </div>

          {showNotif ? (
            <div id="notif-panel" className="card" style={{ marginTop: 12, padding: 12 }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <strong>Notifications</strong>
                <button className="btn" onClick={markAllRead}>
                  Mark all read
                </button>
              </div>
              <div className="hr" />
              {items.length ? (
                <div className="stack">
                  {items.map((n) => (
                    <div key={n.id} className="card" style={{ padding: 12, background: "rgba(255,255,255,0.03)" }}>
                      <div className="row" style={{ justifyContent: "space-between" }}>
                        <strong>{n.title}</strong>
                        <span className="small">{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="small" style={{ marginTop: 6 }}>
                        {n.body}
                      </div>
                      {n.orderId ? (
                        <div style={{ marginTop: 10 }}>
                          <Link className="btn" href={`/orders/${n.orderId}`}>
                            View order
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="small" style={{ margin: 0 }}>
                  No notifications yet.
                </p>
              )}
            </div>
          ) : null}
        </div>
      </header>

      <div>{children}</div>

      <footer style={{ borderTop: "1px solid var(--border)", marginTop: 40 }}>
        <div className="container" style={{ padding: "18px 16px" }}>
          <p className="small" style={{ margin: 0 }}>
            Frontend scaffold: role dashboards, auth/profile, browsing, cart/checkout UI, order tracking, WebSocket notifications.
          </p>
        </div>
      </footer>
    </div>
  );
}
