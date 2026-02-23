"use client";

import React from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/apiClient";
import type { Restaurant } from "@/lib/types";

const mockRestaurants: Restaurant[] = [
  { id: "r1", name: "Green Bowl", cuisine: "Healthy", rating: 4.6, deliveryFee: 2.99, etaMinutes: 25 },
  { id: "r2", name: "Pasta Palace", cuisine: "Italian", rating: 4.4, deliveryFee: 3.49, etaMinutes: 30 },
  { id: "r3", name: "Spice Route", cuisine: "Indian", rating: 4.7, deliveryFee: 2.49, etaMinutes: 35 }
];

export default function RestaurantsPage() {
  const [q, setQ] = React.useState("");
  const [items, setItems] = React.useState<Restaurant[]>([]);
  const [busy, setBusy] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setBusy(true);
      try {
        const res = await apiRequest<Restaurant[]>("/restaurants");
        if (!cancelled) setItems(res);
      } catch {
        if (!cancelled) setItems(mockRestaurants);
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = items.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()) || (r.cuisine ?? "").toLowerCase().includes(q.toLowerCase()));

  return (
    <main className="container" style={{ padding: "28px 0" }}>
      <div className="stack">
        <div className="card" style={{ padding: 18 }}>
          <h1 className="h1">Restaurants</h1>
          <div className="row" style={{ marginTop: 12, flexWrap: "wrap" }}>
            <input className="input" placeholder="Search by name or cuisine..." value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 420 }} />
            <span className="badge">{busy ? "Loading..." : `${filtered.length} results`}</span>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {filtered.map((r) => (
            <div key={r.id} className="card" style={{ padding: 16 }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <strong>{r.name}</strong>
                {r.rating ? <span className="badge">★ {r.rating.toFixed(1)}</span> : null}
              </div>
              <div className="small" style={{ marginTop: 8 }}>
                {r.cuisine ?? "Cuisine"} • Fee: ${Number(r.deliveryFee ?? 0).toFixed(2)} • ETA: {r.etaMinutes ?? 30}m
              </div>
              <div className="row" style={{ marginTop: 12 }}>
                <Link className="btn btnPrimary" href={`/restaurants/${r.id}`}>
                  View menu
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
