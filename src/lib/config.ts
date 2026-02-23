export type RuntimeConfig = {
  apiBaseUrl: string;
  wsUrl: string;
  siteUrl: string;
};

// PUBLIC_INTERFACE
export function getRuntimeConfig(): RuntimeConfig {
  /** Returns runtime configuration from environment variables (client-safe NEXT_PUBLIC_*). */
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  return {
    apiBaseUrl,
    wsUrl,
    siteUrl
  };
}

// PUBLIC_INTERFACE
export function assertRuntimeConfig(): RuntimeConfig {
  /** Ensures required runtime config is present and throws a descriptive error if not. */
  const cfg = getRuntimeConfig();
  const missing: string[] = [];
  if (!cfg.apiBaseUrl) missing.push("NEXT_PUBLIC_API_BASE_URL");
  if (!cfg.wsUrl) missing.push("NEXT_PUBLIC_WS_URL");
  if (!cfg.siteUrl) missing.push("NEXT_PUBLIC_SITE_URL");

  if (missing.length) {
    throw new Error(
      `Missing required env vars: ${missing.join(
        ", "
      )}. Create .env.local from .env.example (do not commit secrets).`
    );
  }
  return cfg;
}
