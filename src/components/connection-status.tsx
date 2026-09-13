"use client";

import { useConvexConnectionState, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export function ConnectionStatus() {
  const health = useQuery(api.health.check);
  const connection = useConvexConnectionState();
  const connected = connection.isWebSocketConnected && health?.status === "ok";
  const label = connected
    ? "Connected"
    : connection.hasEverConnected
      ? "Reconnecting..."
      : "Connecting...";

  return (
    <span
      role="status"
      className="inline-flex items-center gap-2.5 text-sm text-stone-600"
    >
      <span
        aria-hidden="true"
        className={`size-2 rounded-full ${connected ? "bg-emerald-600" : "bg-amber-500"}`}
      />
      {label}
    </span>
  );
}
