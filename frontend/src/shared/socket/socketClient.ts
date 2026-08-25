import { io, type Socket } from "socket.io-client";

import { tokenStorage } from "@/shared/api/http";

let socket: Socket | null = null;

export function connectSocket(token: string) {
  socket = io("/", {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 15,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
  });

  socket.on("connect_error", (err) => {
    console.error("[socket] connect_error:", err.message);
    const data = (err as Error & { data?: { statusCode?: number } }).data;
    if (data?.statusCode === 401) {
      tokenStorage.clear();
      window.location.reload();
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("[socket] disconnected:", reason);
  });

  socket.on("reconnect", () => {
    console.log("[socket] reconnected");
  });

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function getSocket() {
  return socket;
}
