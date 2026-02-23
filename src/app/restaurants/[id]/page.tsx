"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/apiClient";
import type { MenuItem, Restaurant } from "@/lib/types";
import { useCartStore } from "@/stores/cartStore";

const mockMenus: Record<string, MenuItem[]> = {
  r1: [
    { id: "m1", restaurantId: "r1", name: "Avocado Salad", description: "Fresh greens, avocado, citrus vinaigrette", price: 11.5, available: true },
    { id: "m2", restaurantId: "r1", name: "Protein Bowl", description: "Brown rice, veggies, tofu/chicken", price: 13.0, available: true }
  ],
  r2: [
    { id: "m3", restaurantId: "r2", name: "Spaghetti Carbonara", description: "Classic creamy carbonara", price: 14.25, available: true },
    { id: "m4", restaurantId: "r2", name: "Marinara Penne", description: "Tomato basil sauce", price: 12.75, available: true }
  ],
  r3: [
    { id: "m5", restaurantId: "r3", name: "Butter Chicken", description: "Rich tomato cream sauce", price: 15.0, available: true },
    { id: "m6", restaurantId: "r3", name: "Chana Masala", description: "Chickpea curry", price: 12.0, available: true }
  ]
};

export default function RestaurantMenuPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const addItem = useCartStore((s) => s.addItem);
  const cartRestaurantId = useCartStore((s) => s.restaurantId);

  const [restaurant, setRestaurant] = React.useState<Restaurant | null>(null);
  const [menu, setMenu] = React.useState<MenuItem[]>([]);
  const [busy, setBusy] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setBusy(true);
      try {
        const [r, m] = await Promise.all([
          apiRequest<Restaurant>(`/restaurants/${id}`),
          apiRequest<MenuItem[]>(`/restaurants/${id}/menu`)
        ]);
        if (!cancelled) {
          setRestaurant(r);
          setMenu(m);
        }
      } catch {
        if (!cancelled) {
          setRestaurant({ id, name: `Restaurant ${id}` });
          setMenu(mockMenus[id] ?? []);
        }
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <main className="container" style={{ padding: "28px 0" }}>
      <div className="stack">
        <div className="card" style={{ padding: 18 }}>
          <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
            <div>
              <h1 className="h1">{restaurant?.name ?? "Restaurant"}</h1>
              <p className="small" style={{ marginTop: 8 }}>
                {busy ? "Loading menu..." : `${menu.length} items`}
                {cartRestaurantId && cartRestaurantId !== id ? (
                  <span className="badge" style={{ marginLeft: 10, borderColor: "rgba(239,68,68,0.45)" }}>
                    Cart has items from another restaurant — adding will reset cart.
                  </span>
                ) : null}
              </p>
            </div>
            <Link className="btn" href="/cart">
              Go to cart
            </Link>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {menu.map((mi) => (
            <div key={mi.id} className="card" style={{ padding: 16 }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <strong>{mi.name}</strong>
                <span className="badge">${mi.price.toFixed(2)}</span>
              </div>
              {mi.description ? (
                <p className="small" style={{ marginTop: 8 }}>
                  {mi.description}
                </p>
              ) : null}
              <div className="row" style={{ marginTop: 12, justifyContent: "space-between" }}>
                <button className="btn btnPrimary" onClick={() => addItem(mi)} disabled={mi.available === false}>
                  Add
                </button>
                {mi.available === false ? <span className="badge">Unavailable</span> : null}
              </div>
            </div>
          ))}
        </div>

        {!menu.length && !busy ? (
          <div className="card" style={{ padding: 18 }}>
            <p className="small" style={{ margin: 0 }}>
              No menu items found.
            </p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
