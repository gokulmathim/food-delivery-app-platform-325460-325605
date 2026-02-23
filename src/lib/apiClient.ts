import { getRuntimeConfig } from "@/lib/config";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  token?: string | null;
  body?: unknown;
  signal?: AbortSignal;
};

// PUBLIC_INTERFACE
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  /** Calls backend REST API using NEXT_PUBLIC_API_BASE_URL and returns typed JSON. */
  const { apiBaseUrl } = getRuntimeConfig();
  const url = `${apiBaseUrl.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers: Record<string, string> = {
    Accept: "application/json"
  };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  const res = await fetch(url, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await res.json().catch(() => undefined) : await res.text().catch(() => undefined);

  if (!res.ok) {
    const message =
      typeof payload === "object" && payload && "detail" in (payload as any) ? String((payload as any).detail) : `HTTP ${res.status}`;
    throw new ApiError(message, res.status, payload);
  }

  return payload as T;
}
