# Food Delivery Frontend (Next.js)

This repository contains the **food_delivery_frontend** web app for the multi-role food delivery platform.

## Features (scaffolded)
- Auth (login/register) + profile editing (token stored in localStorage)
- Role-based dashboard routing (customer/restaurant/courier/admin)
- Restaurant browsing + menu browsing
- Cart management + checkout UI (creates an order via REST)
- Orders list + order tracking page
- WebSocket-driven notifications + order status updates (when backend is available)

## Environment variables
Create a `.env.local` from `.env.example`:

- `NEXT_PUBLIC_API_BASE_URL` (REST base, e.g. `http://localhost:8000`)
- `NEXT_PUBLIC_WS_URL` (WS endpoint, e.g. `ws://localhost:8000/ws`)
- `NEXT_PUBLIC_SITE_URL` (site URL, e.g. `http://localhost:3000`)

## Running
```bash
npm install
npm run dev
```

Open http://localhost:3000

## Notes
This frontend is wired to backend REST/WS endpoints, but includes **mock fallbacks** to keep the UI navigable while backend endpoints are implemented.
