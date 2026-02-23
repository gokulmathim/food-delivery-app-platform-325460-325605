"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import { useOrdersStore } from "@/stores/ordersStore";
import { useAuthStore } from "@/stores/authStore";

export default function CartPage() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);

  const restaurantId = useCartStore((s) => s.restaurantId);
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const total = useCartStore((s) => s.total);

  const createOrder = useOrdersStore((s) => s.createOrder);

  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const subtotal = total();
  const deliveryFee = items.length ? 3.49 : 0;
  const taxes = items.length ? Math.round(subtotal * 0.08 * 100) / 100 : 0;
  const grandTotal = subtotal + deliveryFee + taxes;

  async function onCheckout() {
    setError(null);
    if (!session) {
      router.push("/auth/login");
      return;
    }
    if (!restaurantId || !items.length) return;

    setBusy(true);
    try {
      const order = await createOrder({
        restaurantId,
        items: items.map((ci) => ({ menuItemId: ci.item.id, quantity: ci.quantity }))
      });
      clear();
      router.push(`/orders/${order.id}`);
    } catch (e: any) {
      setError(e?.message ?? "Checkout failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container" style={{ padding: "28px 0" }}>
      <div className="grid" style={{ gridTemplateColumns: "1.2fr 0.8fr", alignItems: "start" }}>
        <div className="card" style={{ padding: 18 }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h1 className="h1">Cart</h1>
            {items.length ? (
              <button className="btn btnDanger" onClick={clear}>
                Clear
              </button>
            ) : null}
          </div>
          <div className="hr" />

          {!items.length ? (
            <div className="stack">
              <p className="small" style={{ margin: 0 }}>
                Your cart is empty.
              </p>
              <Link className="btn btnPrimary" href="/restaurants">
                Browse restaurants
              </Link>
            </div>
          ) : (
            <div className="stack">
              {items.map((ci) => (
                <div key={ci.item.id} className="card" style={{ padding: 12, background: "rgba(255,255,255,0.03)" }}>
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <strong>{ci.item.name}</strong>
                    <span className="badge">${(ci.item.price * ci.quantity).toFixed(2)}</span>
                  </div>
                  <div className="small" style={{ marginTop: 6 }}>
                    ${ci.item.price.toFixed(2)} each
                  </div>
                  <div className="row" style={{ marginTop: 10, flexWrap: "wrap" }}>
                    <button className="btn" onClick={() => setQuantity(ci.item.id, ci.quantity - 1)}>
                      -
                    </button>
                    <span className="badge">Qty: {ci.quantity}</span>
                    <button className="btn" onClick={() => setQuantity(ci.item.id, ci.quantity + 1)}>
                      +
                    </button>
                    <button className="btn btnDanger" onClick={() => removeItem(ci.item.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card" style={{ padding: 18 }}>
          <h2 className="h2">Checkout</h2>
          <div className="hr" />
          <div className="stack" style={{ gap: 8 }}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <span className="small">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <span className="small">Delivery fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <span className="small">Taxes</span>
              <span>${taxes.toFixed(2)}</span>
            </div>
            <div className="hr" />
            <div className="row" style={{ justifyContent: "space-between" }}>
              <strong>Total</strong>
              <strong>${grandTotal.toFixed(2)}</strong>
            </div>

            {error ? (
              <div className="badge" style={{ borderColor: "rgba(239,68,68,0.45)", color: "rgba(254,202,202,0.95)" }}>
                {error}
              </div>
            ) : null}

            <button className="btn btnPrimary" disabled={!items.length || busy} onClick={onCheckout}>
              {busy ? "Placing order..." : session ? "Place order" : "Login to checkout"}
            </button>
            <p className="small" style={{ margin: 0 }}>
              Payment initiation (Stripe) will be triggered by backend; this UI currently creates an order via REST.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
