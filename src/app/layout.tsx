import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { Shell } from "@/components/layout/Shell";

export const metadata: Metadata = {
  title: "Food Delivery Platform",
  description: "Multi-role food delivery app (customer, restaurant, courier, admin)."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <Shell>{children}</Shell>
        </AppProviders>
      </body>
    </html>
  );
}
