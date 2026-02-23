"use client";

export function AdminDashboard() {
  return (
    <div className="stack">
      <div className="card" style={{ padding: 18 }}>
        <h1 className="h1">Admin Dashboard</h1>
        <p className="small" style={{ marginTop: 8 }}>
          Manage users/restaurants/orders and review platform health (analytics to be backed by API).
        </p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <div className="card" style={{ padding: 16 }}>
          <h2 className="h2">Moderation</h2>
          <div className="hr" />
          <p className="small">User / restaurant approvals and flags.</p>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <h2 className="h2">Orders</h2>
          <div className="hr" />
          <p className="small">Monitor live orders, cancellations, refunds.</p>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <h2 className="h2">Analytics</h2>
          <div className="hr" />
          <p className="small">KPIs: conversions, delivery times, revenue.</p>
        </div>
      </div>
    </div>
  );
}
