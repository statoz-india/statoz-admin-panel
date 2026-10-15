"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "@/app/store/authStore";

/** The backend honours at most this many ids per `subscribe_match_stats`. */
export const MAX_IDS_PER_SUBSCRIBE = 100;

export type MatchStatsGameType = "cricket" | "football" | "basketball";

/** One tick's push for one match. Always a full snapshot, never a delta. */
export interface MatchStatsPayload {
  updatedAt: string;
  espnEventId: string;
  matchId: string | null;
  league?: string;
  gameType?: MatchStatsGameType | string;
  summary: Record<string, unknown>;
}

export type SocketStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export interface MatchStatsSocketState {
  status: SocketStatus;
  error: string;
  /** Latest payload per `espnEventId`; a match with no tick yet is absent. */
  statsByEventId: Record<string, MatchStatsPayload>;
  /** When this client last received any payload, for a "live" heartbeat. */
  lastPayloadAt: string | null;
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function isStatsPayload(value: unknown): value is MatchStatsPayload {
  if (!value || typeof value !== "object") return false;
  const payload = value as Record<string, unknown>;
  return (
    typeof payload.espnEventId === "string" &&
    !!payload.summary &&
    typeof payload.summary === "object"
  );
}

/**
 * Subscribes to per-match live statistics over Socket.IO.
 *
 * The poller pushes a full summary for every live match once a minute, so a
 * client that joins mid-match sees nothing for up to 60s — there is no replay
 * on subscribe. Payloads are kept keyed by `espnEventId` and last write wins.
 */
export function useMatchStatsSocket(
  espnEventIds: string[],
  options?: { enabled?: boolean },
): MatchStatsSocketState {
  const enabled = options?.enabled !== false;
  const token = useAuthStore((state) => state.token);

  const [socketUrl, setSocketUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<SocketStatus>("idle");
  const [error, setError] = useState("");
  const [statsByEventId, setStatsByEventId] = useState<
    Record<string, MatchStatsPayload>
  >({});
  const [lastPayloadAt, setLastPayloadAt] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  /** The ids as of *now*, for the connect handler that fires later. */
  const idsRef = useRef<string[]>([]);
  /** Ids the *server* currently has us in rooms for, so we can diff. */
  const subscribedRef = useRef<Set<string>>(new Set());

  // Sorted + de-duped so a re-render with the same ids doesn't resubscribe.
  const idsKey = useMemo(
    () => Array.from(new Set(espnEventIds.filter(Boolean))).sort().join(","),
    [espnEventIds],
  );
  const ids = useMemo(() => (idsKey ? idsKey.split(",") : []), [idsKey]);
  idsRef.current = ids;

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/socket-config", {
          credentials: "include",
        });
        const body = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok || !body?.success || !body?.data?.url) {
          throw new Error(body?.message || "Socket URL is not configured");
        }
        setSocketUrl(body.data.url as string);
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setError(
          err instanceof Error ? err.message : "Socket URL is not configured",
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !socketUrl) return;

    if (!token) {
      setStatus("error");
      setError("Not signed in — the stats socket rejects anonymous clients.");
      return;
    }

    setStatus("connecting");
    setError("");

    const socket = io(socketUrl, {
      auth: { token },
      withCredentials: true,
      // A dropped socket only costs a gap in updates, so keep retrying quietly.
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });
    socketRef.current = socket;

    const onConnect = () => {
      setStatus("connected");
      setError("");
      // A reconnect is a fresh session on the server: rooms are gone.
      subscribedRef.current = new Set();
      const pending = idsRef.current;
      if (pending.length > 0) {
        for (const batch of chunk(pending, MAX_IDS_PER_SUBSCRIBE)) {
          socket.emit("subscribe_match_stats", batch);
        }
        subscribedRef.current = new Set(pending);
      }
    };

    const onDisconnect = () => {
      setStatus("disconnected");
      subscribedRef.current = new Set();
    };

    const onConnectError = (err: Error) => {
      setStatus("error");
      setError(err?.message || "Could not connect to the stats socket");
    };

    const onStats = (payload: unknown) => {
      if (!isStatsPayload(payload)) return;
      setStatsByEventId((prev) => ({
        ...prev,
        [payload.espnEventId]: payload,
      }));
      setLastPayloadAt(new Date().toISOString());
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("match_stats_updated", onStats);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("match_stats_updated", onStats);
      socket.disconnect();
      socketRef.current = null;
      subscribedRef.current = new Set();
      setStatus("idle");
    };
  }, [enabled, socketUrl, token]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || status !== "connected") return;

    const wanted = new Set(ids);
    const current = subscribedRef.current;

    const toSubscribe = ids.filter((id) => !current.has(id));
    const toUnsubscribe = Array.from(current).filter((id) => !wanted.has(id));

    for (const batch of chunk(toSubscribe, MAX_IDS_PER_SUBSCRIBE)) {
      socket.emit("subscribe_match_stats", batch);
    }
    for (const batch of chunk(toUnsubscribe, MAX_IDS_PER_SUBSCRIBE)) {
      socket.emit("unsubscribe_match_stats", batch);
    }

    subscribedRef.current = wanted;
  }, [ids, status]);

  // A match that left the registry keeps no payload around to render.
  useEffect(() => {
    setStatsByEventId((prev) => {
      const wanted = new Set(ids);
      const kept = Object.keys(prev).filter((id) => wanted.has(id));
      if (kept.length === Object.keys(prev).length) return prev;
      return Object.fromEntries(kept.map((id) => [id, prev[id]]));
    });
  }, [ids]);

  return { status, error, statsByEventId, lastPayloadAt };
}

/** "12s ago" / "3m ago" — the age of a tick, for the live badges. */
export function useRelativeTime(iso: string | null | undefined): string {
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return formatRelativeTime(iso);
}

export function formatRelativeTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "—";
  const seconds = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m ago`;
}
