"use client";

import { getRuntimeConfig } from "@/lib/config";
import type { NotificationMessage } from "@/lib/types";

export type WsEvent =
  | { type: "notification"; payload: NotificationMessage }
  | { type: "order_status"; payload: { orderId: string; status: string } }
  | { type: "ping" };

type WsClientOptions = {
  token?: string | null;
  onEvent: (event: WsEvent) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (err: Event) => void;
};

export class WsClient {
  private ws: WebSocket | null = null;
  private opts: WsClientOptions;

  constructor(opts: WsClientOptions) {
    this.opts = opts;
  }

  // PUBLIC_INTERFACE
  connect(): void {
    /** Opens the WebSocket connection to NEXT_PUBLIC_WS_URL and starts receiving events. */
    const { wsUrl } = getRuntimeConfig();
    const url = new URL(wsUrl);
    if (this.opts.token) url.searchParams.set("token", this.opts.token);

    this.ws = new WebSocket(url.toString());

    this.ws.onopen = () => this.opts.onOpen?.();
    this.ws.onclose = () => this.opts.onClose?.();
    this.ws.onerror = (e) => this.opts.onError?.(e);

    this.ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(String(msg.data)) as WsEvent;
        this.opts.onEvent(data);
      } catch {
        // ignore non-JSON frames
      }
    };
  }

  // PUBLIC_INTERFACE
  disconnect(): void {
    /** Closes the WebSocket connection if open. */
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      this.ws.close();
    }
    this.ws = null;
  }
}
