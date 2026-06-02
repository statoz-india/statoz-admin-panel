"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/app/store/authStore";
import {
  getSocket,
  type MatchEventUpdatedPayload,
} from "@/lib/socket";
import type { MatchData } from "@/app/api/match/route";

type Setter = React.Dispatch<React.SetStateAction<MatchData[]>>;

export function useMatchLiveScores(
  setMatches: Setter,
  options: { enabled: boolean; onReconnectResync?: () => void } = {
    enabled: true,
  },
): void {
  const token = useAuthStore((s) => s.token);
  const { enabled, onReconnectResync } = options;

  useEffect(() => {
    if (!enabled || !token) return;

    const socket = getSocket(token);

    const subscribe = () => socket.emit("subscribe_match_events");

    if (socket.connected) {
      subscribe();
    } else {
      socket.once("connect", subscribe);
    }

    const onUpdate = (payload: MatchEventUpdatedPayload) => {
      if (!payload?.updates?.length) return;
      setMatches((prev) => {
        const byId = new Map<string, (typeof payload.updates)[number]>();
        for (const u of payload.updates) byId.set(u._id, u);

        let changed = false;
        const next = prev.map((m) => {
          const u = byId.get(m._id);
          if (!u) return m;
          changed = true;
          return { ...m, matchEvent: u.matchEvent };
        });
        return changed ? next : prev;
      });
    };

    const onReconnect = () => {
      subscribe();
      onReconnectResync?.();
    };

    socket.on("match_event_updated", onUpdate);
    socket.io.on("reconnect", onReconnect);

    return () => {
      socket.emit("unsubscribe_match_events");
      socket.off("match_event_updated", onUpdate);
      socket.io.off("reconnect", onReconnect);
      socket.off("connect", subscribe);
    };
  }, [enabled, token, setMatches, onReconnectResync]);
}
